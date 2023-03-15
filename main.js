// @todo utilize node.js env to create hidden variables for sensitive items
const CLIENT_ID = '82239172473-7c2eciiop7suofr96l58qmqm2dl1g1hr.apps.googleusercontent.com';
const API_KEY = 'AIzaSyC4CLRA-17ylFefzZjlsZBzf2gucLgL5Do';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly';

function loadClient() {
    gapi.load('client', initGAPI)
}

async function initGAPI() {
    await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES,
        plugin_name: "Road trip"
    }),
        gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: '1YAK04Fd5yeVL-ySkBsAUrfpuA-_zy-O-v0AY1SxmFRM',
            range: 'Sheet1!A1:H20',
        }).then(function (response) {
            var range = response.result;
            var result = [];
            if (range.values.length > 1) {
                var headers = range.values[0];
                for (var i = 1; i < range.values.length; i++) {
                    var obj = {};
                    var currentRow = range.values[i];
                    for (var j = 0; j < headers.length; j++) {
                        obj[headers[j]] = currentRow[j];
                    }
                    result.push(obj);
                }
                const column = document.querySelector(".column");
                // utilize template literals to return the whole original article with each object populated
                let displayMenu = result.map(function (item) {
                    return `<article id="${item.id}" class="menu-item">
                    <div class="name-price">
                        <h3 class="dish-name">${item.dishName}</h3>
                        <span class="price">${item.price}</span>
                    </div>
                    <img src="${item.dishImage}" alt="${item.dishName}" class="dish-image">
                    <p class="description">${item.description}</p>
                    <div class="restaurant-details">
                        <a href="${item.restaurantURL}" target="_blank" class="restaurant-name">${item.restaurantName}</a>
                        <p class="restaurant-location">- ${item.restaurantLocation}</p>
                    </div>
                    <hr id="menu-line">
                </article>`;
                }); displayMenu = displayMenu.join("");
                column.innerHTML = displayMenu;
            } else {
                console.log('No data found.');
            }
        }, function (response) {
            console.log('Error: ' + response.result.error.message);
        });


}

// populating menu section of site with each menu item found in the spreadsheet 

