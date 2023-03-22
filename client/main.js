const column = document.querySelector(".column");

async function fetchData() {
  const response = await fetch('/data');
  const data = await response.json();

  // Convert the data array into an array of objects
  const headers = data[0];
  const rows = data.slice(1);
  const result = rows.map(row => {
    const item = {};
    row.forEach((cell, index) => {
      const key = headers[index];
      item[key] = cell;
    });
    return item;
  });

  // Render the data using the existing code
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
    </article>`;
  });
  displayMenu = displayMenu.join("");
  column.innerHTML = displayMenu;
}

fetchData();

function showArticles(id) {
    const articles = document.querySelectorAll('article');

    articles.forEach(article => {
        if (article.id === id) {
            article.style.display = 'block';
        } else {
            article.style.display = 'none';
        }
    });
}

const state = document.querySelectorAll('button.state');

state.forEach(button => {
    button.addEventListener('click', event => {
        const id = event.target.id;
        showArticles(id);
    });
});

const all = document.getElementById('all')

all.addEventListener('click', () => {
    const articles = document.querySelectorAll('article');
    articles.forEach(article => {
        article.style.display = 'block';
    });
});
