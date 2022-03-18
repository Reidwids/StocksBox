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
        `<div class="row asset">
        <div class="form-group col-md-3">
            <label class="form-label"> Asset Ticker: </label>
            <input type="text" name="assetName" class="form-control" placeholder="Ex. TSLA" required/>
        </div>
        <div class="form-group col-md-3" id="assetType">
            <label class="form-label"> Type of Asset: </label>
            <select name="typeOfAsset" class="form-select" required>
                <!-- Note that the values here are 1 digit so that the length function works in our controller -->
                <!-- if you change the below, you must change in static java as well -->
                <option value="S" selected>US Stocks</option>
                <option value="C">Crypto</option>
            </select>
        </div>
        <div class="form-group col-md-3">
            <label class="form-label"> Price Obtained: </label>
            <input type="number" name="priceObtained" class="form-control" min=0 required/>
        </div>
        <div class="form-group col-md-3">
            <label class="form-label"> Quantity Owned: </label>
            <input type="number" name="qtyOwned" class="form-control" min=0 required/>
        </div>
    </div>`
    )
}
function searchUsers(){
    console.log('hello')
}


