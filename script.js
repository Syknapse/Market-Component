const tokenAPI = 'api/token.json'; // http://api.comprea.com/user/session
const marketAPI = 'api/postalcode.json'; // `http://api.comprea.com/user/postalcode?token=${token}&postalcode=${postalCodeInput}`
const productsAPI = 'api/categories.json'; // `http://api.comprea.com/company/categories?token=${token}&company_id=${selectedMarket.id}`
let token;
let marketInput = 'Mercadona';
let postalCodeInput = 28010;
let selectedMarket;
let selectedMarketColor;
let selectedMarketIcon;
const header = document.getElementById('nav-header');
const marketIcon = document.querySelector('#nav-header img');
const marketName = document.querySelector('#nav-header h1');
const marketPostalCode = document.querySelector('#nav-header p');
const productCategories = document.getElementById('product-categories');

fetch(tokenAPI)
.then(response => {
        response.json().then(data => {
            token = data.token;
        })
})
.then(
    fetch(marketAPI)
    .then(response => {
            response.json().then(data => {
                selectedMarket = data.markets.find(thisMarket);
                marketIcon.setAttribute('src', selectedMarket.icon);
                marketName.innerText = `${selectedMarket.name}`;
                marketPostalCode.innerText = `Comprando en ${postalCodeInput}`;
                header.style.backgroundColor = `rgb(${selectedMarket.color})`;
            })
    })
)
.then(
    fetch(productsAPI)
    .then(response => {
            response.json().then(data => {
                data.categories.forEach(category => {
                    let categorySection = document.createElement('li');
                    let categoryIcon = document.createElement('span');
                    let categoryName = document.createElement('span');
                    let subcategories = document.createElement('ul');
                    let arrow = document.createElement('span');
                    let subcategoryDisplay = '';

                    productCategories.appendChild(categorySection);
                    categorySection.appendChild(categoryIcon);
                    categorySection.appendChild(categoryName);
                    categorySection.appendChild(arrow);
                    categorySection.classList.add('category');
                    arrow.classList.add('subcategory-toggle');
                    categorySection.appendChild(subcategories);
                    categoryIcon.style.background = `url(${category.icon}) center / cover no-repeat`;
                    categoryName.innerText = category.name;

                    category.categories.forEach(subcategory => {
                        let subcategoryUrl = `http://api.comprea.com//tienda/${marketInput}/${category.shortcut}/${subcategory.shortcut}`;

                        subcategoryDisplay +=
                        `<li>
                            <a href="${subcategoryUrl}" target="_blank">${subcategory.name}</a>
                        </li>`;
                    })
                    let fullSection = document.createElement('li');
                    let fullSectionLink = document.createElement('a');
                    let categoryUrl = `http://api.comprea.com/tienda/${marketInput}/${category.shortcut}`;

                    subcategories.innerHTML = subcategoryDisplay;
                    subcategories.classList.add('subcategories');
                    subcategories.insertBefore(fullSection, subcategories.firstChild);
                    fullSection.appendChild(fullSectionLink);
                    fullSectionLink.setAttribute('href', categoryUrl);
                    fullSectionLink.innerText = 'Ver toda la sección';

                    categorySection.addEventListener('click', event => {
                        const selected = document.querySelector('.selected');
                        // fire only when category li is clicked
                        if ((event.target && event.target.matches('li.category span')) || (event.target && event.target.matches('li.category'))) {
                            const pressed = document.querySelector('.pressed');
                            event.currentTarget.classList.add('pressed');
                            if (pressed) {
                                pressed.classList.toggle('pressed');
                                selected.classList.remove('selected');
                            }
                        } else if (event.target && event.target.matches('.subcategories li a')) {
                            if (selected) {
                                selected.classList.remove('selected');
                            }
                            event.target.classList.add('selected');
                        }
                    });
                })
                console.log(data);
            })
    })
)

function thisMarket(market) {
    return market.name === `${marketInput}`;
}