const tokenAPI = 'api/token.json'; // http://api.comprea.com/user/session
const marketAPI = 'api/postalcode.json'; // `http://api.comprea.com/user/postalcode?token=${token}&postalcode=${postalCodeInput}`
const productsAPI = 'api/categories.json'; // `http://api.comprea.com/company/categories?token=${token}&company_id=${selectedMarket.id}`
let token;
let marketInput = 'Mercadona';
let postalCodeInput = 28010;
let selectedMarket;
let selectedMarketColor;
let selectedMarketIcon;

fetch(tokenAPI)
.then(response => {
        response.json().then(data => {
            token = data.token;
            // console.log(token);
        })
})

fetch(marketAPI)
.then(response => {
        response.json().then(data => {
            selectedMarket = data.markets.find(thisMarket);
            console.log(selectedMarket.name);
            console.log(selectedMarket.color);
            console.log(selectedMarket.icon);
        })
})

fetch(productsAPI)
.then(response => {
        response.json().then(data => {
            console.log(data);
            console.log(data.categories[0]);
            console.log(data.categories["0"].categories["0"].icon);
        })
})

function thisMarket(market) {
    return market.name === `${marketInput}`;
}

/* fetch('http://api.comprea.com/user/postalcode?token=af8253d50caee90ef4c0f164fbef7792&postalcode=28010')
.then(response => {
        response.json().then(data => {
            console.log(data);
        })
}) */