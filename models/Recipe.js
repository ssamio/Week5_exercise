const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let recipeSchema = new Schema({
    name: String,
    ingredients: [String],
    instructions: [String],
    categories: [Schema.Types.ObjectId],
    images: [Schema.Types.ObjectId]
});

module.exports = mongoose.model("Recipe", recipeSchema, "Recipes");