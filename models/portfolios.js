// Dependencies
const mongoose = require('mongoose');

const portfoliosSchema = mongoose.Schema({
    portfolioName: {
        type: String,
        required: true,
        minlength: [2, "First name must be more than 3 characters"],
        maxlength: [20, "This is too much man.... Chill!!!"]
    },
    assets:[{
        // type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assets'
    }],
    gainsHist: [{
        type: Number,
    }],
    gainsHistTimestamps: [{
        type: Date,
    }]
},
    {
        timestamps: true
    });

const assetsSchema = mongoose.Schema({
    typeOfAsset: {
        type: String,
        required: true,
        enum: ['S', 'C']
    },
    assetName: {
        type: String,
        required: true,
    },
    priceObtained: {
        type: Number,
        required: true,
        min: 0,
    },
    qtyOwned: {
        type: Number,
        required: true,
        min: 0,
    },
    assetGain: {
        type: Number,
    }
},
{
    timestamps: true,
});

const Portfolios = mongoose.model("Portfolios", portfoliosSchema);
const Assets = mongoose.model("Assets", assetsSchema);

module.exports = {Portfolios, Assets};