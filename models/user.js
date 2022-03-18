// Dependencies
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({

    firstName: {
        type: String,
        required: true,
        minlength: [3, "First name must be more than 3 characters"],
        maxlength: [99, "This is too much man.... Chill!!!"]
    },
    lastName: {
        type: String,
        required: true,
        minlength: [3, "First name must be more than 3 characters"],
        maxlength: [99, "This is too much man.... Chill!!!"]
    },
    emailAddress: {
        type: String,
        required: true,
        lowercase: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: [6, "Your password should be atleast 6 characters"]
    },
    image:{
        type: String,
    },
    bio: {
        type: String,
        maxlength: [200, "Less talky-talky more stocky-stocky"],
        required: true,
    },
    investmentGoals: {
        type: String,
        maxlength: [200, "Less talky-talky more stocky-stocky"],
        required: true,
    },
    location: {
        type: String,
        maxlength: [30, "Less talky-talky more stocky-stocky"],
        required: true,
    },
    userGainsHist: [{
        type: Number,
    }],
    userGainsHistTimestamps: [{
        type: Date,
    }],
    portfolios:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Portfolios'
        }],
},
    {
        timestamps: true
    })


    // verifyPassword
    userSchema.methods.verifyPassword = function(password){
        return bcrypt.compareSync(password, this.password);
    }

const User = mongoose.model("User", userSchema);

module.exports = User;