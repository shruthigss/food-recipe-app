const mongoose=require("mongoose")
const Schema=mongoose.Schema

const RecipesSchema = new Schema({
    recipe_title:{
        type:String, Required:true
    },
    Author:{
        type:String
    },
    Ingredients:[{
        type:String,Required:true
    }],
    description:{
        type:String,Required:true
    },
    Cuisine:{
        type:String
    },
    steps: [{
        type: String
    }],
    Image:{
        type:String,Required:true
    },
    Authoremail:{
        type:String
    }
})

const RecipesModel = mongoose.model("Recipes", RecipesSchema);

module.exports = RecipesModel;