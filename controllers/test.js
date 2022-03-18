const finnhub = require('finnhub');
require('dotenv').config();
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = 'c8llfdqad3ie52gnac3g';
const finnhubClient = new finnhub.DefaultApi();

async function getSymbols(){
    let data2 = await new Promise((resolve, reject)=>{
        finnhubClient.cryptoSymbols("BINANCE", (error, data, response) => {
            resolve(data);
        });
    });
    return data2
}
async function get(){
    let data = await getSymbols()
    let regex = /USDT/;
    let USDTCryptos = [];
    data.forEach(symbol=>{
        if (regex.test(symbol.symbol)){
            USDTCryptos.push(symbol.symbol);
        }
    })
}

async function getPrice(ticker){
    let temp = "BINANCE:USDT";
    let input = temp.slice(0,8)+ticker+temp.slice(8)
    let date = Math.round((new Date()).getTime()/1000);
    console.log('input: ', date)

    let data2 = await new Promise((resolve, reject)=>{
        finnhubClient.cryptoCandles(input, 1, date-100, date, (error, data, response) => {
            resolve(data.c[0]);
        });
    });
    return data2
}
async function get1(){
    let data = await getPrice('BTC');
    console.log(data);
}
get1();
// let ticker = 'TD'
// async function getQuote(ticker){
//     let quote = await new Promise((resolve, reject)=>{
//         finnhubClient.quote(ticker, (error, data, response) => {
//         console.log(data)
//         resolve(data.c)
//         });
//     });
//     return quote;
// }

// async function run() {
//     let data = await getQuote(ticker);
//     console.log(data)
//     data = data*2
//     console.log(data)// will print your data
// }

// run();
