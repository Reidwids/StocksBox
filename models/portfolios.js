// Dependencies
const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema({
    portfolioName: {
        type: String,
        required: true,
        minlength: [3, "First name must be more than 3 characters"],
        maxlength: [99, "This is too much man.... Chill!!!"]
    },
    assets:[{
        // type: String,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Assets'
    }],
    isPublic: {
        type: Boolean,
        required: true,
    }
},
    {
        timestamps: true
    });

const assetsSchema = mongoose.Schema({
    typeOfAsset: {
        type: String,
        // required: true,
        enum: ['S', 'C']
    },
    assetName: {
        type: String,
        // required: true,
    },
    priceObtained: {
        type: Number,
        // required: true,
        min: 0,
    },
},
{
    timestamps: true,
});

const Portfolio = mongoose.model("Portfolio", portfolioSchema);
const Assets = mongoose.model("Assets", assetsSchema);

module.exports = {Portfolio, Assets};