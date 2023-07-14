var express = require('express');
var router = express.Router();
const multer = require("multer");
const Recipe = require('../models/Recipe');
const Category = require('../models/Category');
const Image = require('../models/Image');
var fs = require('fs');
const upload = multer({ dest: 'uploads/' });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Recipes' });
});

//GET for recipe
router.get('/recipe/:food', async function(req, res, next) {
  try{
    const recipe = await Recipe.findOne({name: req.params.food}).exec();
  
    if(!recipe){
      return res.status(404).send("Recipe not found")
      }

      else{
        return res.send(recipe);
      }  
    }
  
    catch(err){
      return next(err);
    }
  }); 

//GET categories from database
router.get('/category', async function(req, res, next) {
  try{
    const result = await Category.find().exec();
    
    res.send(result);
    }
  
    catch(err){
      return next(err);
    }
  }); 


//POST recipes to database
router.post("/recipe/",  async function(req, res, next) {
  try{
  const recipe = await Recipe.findOne({name: req.body.name}).exec();

  if(!recipe){
    ingredients = [];
    instructions = [];
    category = [];
    
    //Ton of checkers because of inconsistency of http-requstest body data format

    if(Array.isArray(req.body.ingredients)){
      ingredients = req.body.ingredients;
    }
    else{
      ingredients = req.body.ingredients.split(",");
    }

    if(Array.isArray(req.body.instructions)){
      instructions = req.body.instructions;
    }
    else{
      instructions = req.body.instructions.split(",");
    }

    if(Array.isArray(req.body.categories)){
      category = req.body.categories
    }
    else if (req.body.categories != ""){
      category = req.body.categories.split(",");
    }

    let newRecipe = new Recipe({
      name: req.body.name,
      ingredients: ingredients,
      instructions: instructions,
      categories: category
      });

      try{
        await newRecipe.save();
        return res.send("Recipe saved to database!")
      }
      catch(err){
        return next(err);
      }
    }
    else{
      return res.status(403).send("Recipe exists already!")
    }  
  }

  catch(err){
    return next(err);
  }
});
//POST images to database
router.post("/images", upload.single('images'), async (req, res, next) => {
  let newImage = new Image({
    name: req.file.originalname,
    buffer: fs.readFileSync(req.file.path),
    encoding: req.file.encoding,
    mimetype: req.file.mimetype
  });
  try{
    await newImage.save();
    
      try{
        const image = await Image.findOne({name: req.file.originalname}).exec();
        const target = await Recipe.findOne({name: req.body.recipe}).exec();
        let targetArray = target.images;
        targetArray.push(image._id);
        const update = {images: targetArray};
        const filter = { name: req.body.recipe};
        
        await Recipe.findOneAndUpdate(filter, update);
      }

      finally{  
      return res.send("Image saved to database!")
      }
  }
  catch(err){
    return next(err);
  }
});

//GET them images from database
router.get("/images/:imageId", async(req, res, next) =>{
  const target = await Image.findById(req.params.imageId).exec();
  res.set({
    "Content-Disposition" : "inline",
    "Content-Type": target.mimetype
  })
  res.send(target.buffer);
});

module.exports = router;
