const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
username: {
    type: String,
    required: true
},
email: {
    type: String,
    required: true,
    unique: true
},
password: {
    type: String,
    required: true 
},
bio:{
    type: String,
    default: ''
},
location:{ 
    type: String,
    default: ''
},
title:String,
phone: String,
avatar:String,

}, { timestamps: true });

module.exports = mongoose.model('user', userSchema);
