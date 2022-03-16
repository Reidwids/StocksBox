/*--- Query Selectors---*/
const newAsset = $('#newAsset');
const allAssets = $('#allAssets');
const searchBar = $('#searchBar');
newAsset.click(addAssetHTML);
searchBar.keyup(searchUsers);
let assetCounter = 1

function addAssetHTML(){
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
                    <option value="S" selected>US Stocks</option>
                    <option value="C">Crypto Currency</option>
                </select>
            </div>
            <div class="form-group">
                <label> Price Obtained: </label>
                <input type="number" name="priceObtained" class="form-control" min=0/>
            </div>
            <div class="form-group">
                    <label> Quantity Owned: </label>
                    <input type="number" name="qtyOwned" class="form-control" min=0/>
            </div>
        </div>`
    )
}
function searchUsers(){
    console.log('hello')
}


