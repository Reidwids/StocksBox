// Dependencies
const mongoose = require('mongoose');

const portfolioSchema = mongoose.Schema({
    ownerID: {
        type: String
    },
    name: {
        type: String,
        required: true,
        minlength: [3, "First name must be more than 3 characters"],
        maxlength: [99, "This is too much man.... Chill!!!"]
    },
    typeOfAsset: {
        type: String,
        required: true,
        minlength: [3, "First name must be more than 3 characters"],
        maxlength: [99, "This is too much man.... Chill!!!"]
    },
    Assets:[{
        name: {
            type: String,
            required: true,
        },
        priceObtained: {
            type: Number,
            required: true,
        }
    }]

}
,
    {
        timestamps: true
    })

const Portfolio = mongoose.model("Portfolio", portfolioSchema);

module.exports = Portfolio;