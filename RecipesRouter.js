const express = require("express")
const RecipesModel = require("./Models/recipes");
const jwt = require('jsonwebtoken');

const router = express.Router()

router.post("/recipes-post", async (req, res) => {
    try {
      let user = await RecipesModel.create({
        recipe_title: req.body.recipe_title,
        Author: req.body.Author,
        Ingredients:req.body.Ingredients,
        description:req.body.description,
        Cuisine:req.body.Cuisine,
        steps:req.body.steps,
        Image:req.body.Image,
        Authoremail:req.body.Authoremail
      });
      res.status(200)
        .json({
          user
        });
    } catch (err) {
      res.status(500).send({
        message: "Internal Server Error"
    });
    }
  });

 router.get("/recipes-post", async (req, res) => {
    try {
      let user = await RecipesModel.find(req.body.id);
      if (!user)
        res.status(404)
        .send({
          message: "User not found!"
        });
      res.send({
        user
      })
    } catch (err) {
      res.status(500).send({
        message: "Internal Server Error"
    });
    }
  });

  router.get("/recipespost/:id", async (req, res) => {
    const recipeId = req.params.id;
    try {
      const recipe = await RecipesModel.findById(recipeId);
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" });
      }
      res.status(200).json({ recipe });
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  router.get("/recipes-post/:cuisine", async (req, res) => {
    try {
        const cuisine = req.params.cuisine;
        if (!cuisine) {
            return res.status(400).send({
                message: "Cuisine is required in query parameters!"
            });
        }
        const recipes = await RecipesModel.find({ Cuisine: cuisine });
        if (recipes.length === 0) {
            return res.status(404).send({
                message: `No recipes found for Cuisine: ${cuisine}`
            });
        }
        res.send({
            recipes
        });
        
    } catch (err) {
        res.status(500).send({
            message: "Internal Server Error"
        });
    }
});

router.put("/recipes-post/:id", async (req, res) => {
  try {
    const recipeId = req.params.id;

    const existingRecipe = await RecipesModel.findById(recipeId);
    if (!existingRecipe) {
      return res.status(404).json({
        message: "Recipe not found!"
      });
    }
    if (existingRecipe.Authoremail !== req.body.Authoremail) {
        return res.status(403).json({
        message: "You are not the creator of this recipe. Permission denied."
      });
    }

    const updatedRecipe = await RecipesModel.findByIdAndUpdate(
      recipeId,
      {
        $set: {
          recipe_title: req.body.recipe_title,
          Author: req.body.Author,
          Ingredients: req.body.Ingredients,
          description: req.body.description,
          Cuisine: req.body.Cuisine,
          steps: req.body.steps,
          Image: req.body.Image
        }
      },
      { new: true }
    );

    if (!updatedRecipe) {
      return res.status(404).json({
        message: "Recipe not found!"
      });
    }

    res.status(200).json({
      recipe: updatedRecipe
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

router.delete("/recipes-post/:id", async (req, res) => {
  const recipeId = req.params.id;
  try {
    const recipe = await RecipesModel.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    if (req.body.Authoremail !== recipe.Authoremail) {
      return res.status(403).json({ message: "Unauthorized access" });
    }
    await RecipesModel.findByIdAndDelete(recipeId);
    res.status(204).end();

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/recipes-search", async (req, res) => {
  try {
      const searchTerm = req.query.searchTerm;

      if (!searchTerm) {
          return res.status(400).send({
              message: "Search term is required in query parameters!"
          });
      }

      const recipes = await RecipesModel.find({
          $or: [
              { recipe_title: { $regex: searchTerm, $options:'i'} }, 
              { Ingredients: { $regex: searchTerm, $options:'i'} }
          ]
      });

      if (recipes.length === 0) {
          return res.status(404).send({
              message: `No recipes found for search term: ${searchTerm}`
          });
      }
      res.send({
          recipes
      });
  } catch (err) {
      res.status(500).send({
          message: "Internal Server Error"
      });
  }
});

module.exports = router