const mongoose = require('mongoose');


let passwordDetailSchema = new mongoose.Schema({
    type: { 
        type: String, 
        required: true,
    },
    description:{
        type:String,
        required:true
    },
     createdAt: { type: Date, default: Date.now },

})

module.exports=  mongoose.model('passwordDetails',passwordDetailSchema,'passwordDetails')