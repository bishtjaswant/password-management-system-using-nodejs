const mongoose = require('mongoose');


let passwordSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: true, 
        index : {
            unique:true
        }
    },
     createdAt: { type: Date, default: Date.now },

})

module.exports=  mongoose.model('password',passwordSchema,'passwords')