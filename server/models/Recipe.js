const mongoose=require('mongoose');
const commentSchema=new mongoose.Schema({
    text:{
        type:String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const recipeSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    ingredients:[String],
    steps:[String],
    tags:[String],
    cookTime:String,
    difficulty:String,
    image:String,
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true
    },
    favorites:[{type: mongoose.Schema.Types.ObjectId, ref:"User"}],
    comments:[commentSchema]

}, {timestamps:true});

module.exports=mongoose.model('Recipe',recipeSchema);