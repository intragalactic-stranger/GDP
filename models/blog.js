const mongoose =require("mongoose")
const blogSchema = new mongoose.Schema({
userId:{
  type:String,
  required:true
},
title:{
  type:String,
  required:true
},
content:{
  type:String,
  required:true
}

})
module.exports =mongoose.model("Blog",blogSchema)