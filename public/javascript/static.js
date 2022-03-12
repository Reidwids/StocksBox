/*--- Query Selectors---*/
const newAsset = $('#newAsset')
const allAssets = $('#allAssets')
newAsset.click(addAssetHTML);
let assetCounter = 1

function addAssetHTML(){
    console.log("hello")
    assetCounter++;
    allAssets.append(
        `<div id="asset${assetCounter}">
            <div class="form-group">
                <label> Asset Ticker: </label>
                <input type="text" name="assetName" class="form-control" />
            </div>
            <div class="form-group">
                <label> Type of Asset: </label>
                <select name="typeOfAsset" class="custom-select custom-select-sm">
                    <option value="stocks" selected>US Stocks</option>
                    <option value="crypto">Crypto Currency</option>
                </select>
            </div>
            <div class="form-group">
                <label> Price Obtained: </label>
                <input type="number" name="priceObtained" class="form-control" min=0/>
            </div>
        </div>`
    )
}