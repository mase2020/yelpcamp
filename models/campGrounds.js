var mongoose = require("mongoose");


//although it is noSql, it is good to have a base template.
var campGrounds = new mongoose.Schema({
    name: String,
    price: String,
    image: String,
    description:String,
    author:{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        username:String
    },
    comments:[{
       type: mongoose.Schema.Types.ObjectId,
       ref:"Comment"
    }]
});
//this will allow to use camps to edit the db. the variable is the singular of the collections in the db. it will be created as camps.
module.exports = mongoose.model("camp", campGrounds);