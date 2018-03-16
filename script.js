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
            // console.log(token);
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
                    let categoryIcon = document.createElement('img');
                    let categoryName = document.createElement('strong');
                    let subcategories = document.createElement('ul');
                    // let subcategorySection = document.createElement('li');
                    // let subcategoryName = document.createElement('a');
                    let subcategoryDisplay = '';

                    productCategories.appendChild(categorySection);
                    categorySection.appendChild(categoryIcon);
                    categorySection.appendChild(categoryName);
                    categorySection.appendChild(subcategories);
                    categoryIcon.setAttribute('src', category.icon);
                    categoryName.innerText = category.name;

                    // console.log(category.categories);

                    category.categories.forEach(subcategory => {
                        let subcategoryUrl = `/tienda/${marketInput}/${category.shortcut}/${subcategory.shortcut}`;

                        subcategoryDisplay +=
                        `<li>
                            <a href="${subcategoryUrl}">${subcategory.name}</a>
                        </li>`;

                        /* subcategories.appendChild(subcategorySection);
                        subcategorySection.appendChild(subcategoryName);
                        subcategoryName.setAttribute('href', subcategoryUrl);
                        subcategoryName.innerText = subcategory.name; */

                        // console.log(subcategory);
                    })
                    let seeSection = document.createElement('li');
                    let seeSectionLink = document.createElement('a');
                    let categoryUrl = `/tienda/${marketInput}/${category.shortcut}`;

                    subcategories.innerHTML = subcategoryDisplay;
                    subcategories.insertBefore(seeSection, subcategories.firstChild);
                    seeSection.appendChild(seeSectionLink);
                    seeSectionLink.setAttribute('href', categoryUrl);
                    seeSectionLink.innerText = 'Ver toda la sección';
                })
                console.log(data);
                // console.log(data.categories[0]);
                // console.log(data.categories["0"].categories["0"].icon);
            })
    })
)



function thisMarket(market) {
    return market.name === `${marketInput}`;
}

/* fetch('http://api.comprea.com/user/postalcode?token=af8253d50caee90ef4c0f164fbef7792&postalcode=28010')
.then(response => {
        response.json().then(data => {
            console.log(data);
        })
}) */