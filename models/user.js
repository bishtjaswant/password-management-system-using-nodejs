const mongoose = require('mongoose');


let UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        index : {
            unique:true
        }
    },
    email: { 
        type: String, 
        required: true, 
        index : {
            unique:true
        }
    },
    password: { 
        type: String, 
        required: true
    },
    createdAt: { type: Date, default: Date.now },

})

module.exports=  mongoose.model('user',UserSchema,'users')