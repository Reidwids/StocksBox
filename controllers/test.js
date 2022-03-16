// const finnhub = require('finnhub');
// require('dotenv').config();
// const api_key = finnhub.ApiClient.instance.authentications['api_key'];
// api_key.apiKey = process.env.FINNHUB_KEY;
// const finnhubClient = new finnhub.DefaultApi();

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
var moment = require('moment'); 
var date = new Date("2022-03-15T18:30:27.834+00:00"); // some mock date
var date2 = new Date("2022-03-15T18:00:27.834+00:00");
var milliseconds = date.getTime()- date2.getTime(); 
console.log(1000*60*60)
console.log(milliseconds);

let date1 = moment("2022-03-15T18:30:27.834+00:00").format('D/M/YY/LT');
console.log(date1);