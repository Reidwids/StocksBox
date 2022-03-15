const finnhub = require('finnhub');
require('dotenv').config();
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = process.env.FINNHUB_KEY;
const finnhubClient = new finnhub.DefaultApi();

let ticker = 'TD'
async function getQuote(ticker){
    let quote = await new Promise((resolve, reject)=>{
        finnhubClient.quote(ticker, (error, data, response) => {
        console.log(data)
        resolve(data.c)
        });
    });
    return quote;
}

async function run() {
    let data = await getQuote(ticker);
    console.log(data)
    data = data*2
    console.log(data)// will print your data
}

run();
