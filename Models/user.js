const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true
    }
})
userSchema.plugin(passportLocalMongoose);//will add password and username and other functionalities

module.exports = mongoose.model('User', userSchema);