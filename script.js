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
            if (data.status === 'OK') {
                token = data.token;
            } else {
                errorModal();
                throw 'No valid token';
            }
        })
})
.catch(error => console.log(error))
.then(
    fetch(marketAPI)
    .then(response => {
            response.json().then(data => {
                if (data.status === 'OK') {
                    getSelectedMarket(data);
                } else {
                    errorModal();
                    throw 'Not a valid market';
                }
            })
    })
)
.catch(error => console.log(error))
.then(
    fetch(productsAPI)
    .then(response => {
            response.json().then(data => {
                if (data.status === 'OK') {
                    getProductsCategories(data);
                } else {
                    errorModal();
                    throw 'Oops, something went wrong!';
                }
            })
    })
)
.catch(error => console.log(error))

// Handle market ******************
function getSelectedMarket(data) {
    selectedMarket = data.markets.find(thisMarket);
    marketIcon.setAttribute('src', selectedMarket.icon);
    marketName.innerText = `${selectedMarket.name}`;
    marketPostalCode.innerText = `Comprando en ${postalCodeInput}`;
    header.style.backgroundColor = `rgb(${selectedMarket.color})`;
}

function thisMarket(market) {
    return market.name === `${marketInput}`;
}

// Handle product categories ******************
function getProductsCategories(data) {
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
        fullSectionLink.setAttribute('target', '_blank');
        fullSectionLink.innerText = 'Ver toda la sección';

        handleEvents(categorySection);
    })
    console.log(data);
}

// Handle pressed and selected events
function handleEvents(target) {
    target.addEventListener('click', event => {
        const pressed = document.querySelector('.pressed');
        const selected = document.querySelector('.selected');
        // Fire only when category li is clicked
        if ((event.target && event.target.matches('li.category span')) || (event.target && event.target.matches('li.category'))) {
            event.currentTarget.classList.add('pressed');
            if (pressed) {
                pressed.classList.toggle('pressed');
                // Clear selected tick when category is closed
                if(selected) {
                    selected.classList.remove('selected');
                }
            }
        } else if (event.target && event.target.matches('.subcategories li a')) {
            if (selected) {
                selected.classList.remove('selected');
            }
            event.target.classList.add('selected');
            errorModal(); // Temp until product api connected
        }
    });
}

function errorModal() {
    let modalContainer = document.createElement('div');

    modalContainer.classList.add('error-container');
    header.appendChild(modalContainer);
    modalContainer.innerText = 'Sorry! Something went wrong!';
    setTimeout(clearError, 4000);
}

function clearError() {
    document.querySelector('.error-container').remove();
}