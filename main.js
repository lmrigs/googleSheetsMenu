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
            spreadsheetId: '1IyWL5OnurZg8hlohcQUXqJ-QpMWjarXJfpkXVUNO1Kg',
            range: 'Sheet1!A1:J10',
        }).then(function (response) {
            var range = response.result;
            if (range.values.length > 0) {
                console.log(range.values);
                //@todo: localStorage.setItem('access_token', range.values);
            } else {
                console.log('No data found.');
            }
        }, function (response) {
            console.log('Error: ' + response.result.error.message);
        });

}