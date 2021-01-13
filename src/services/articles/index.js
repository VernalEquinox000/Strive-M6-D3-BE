const express = require("express")

const ArticleModel = require("./schema")
const ReviewModel = require("../reviews/schema")

const articlesRouter = express.Router()

//GET articles
articlesRouter.get("/", async (req, res, next) => {
  try {
    const articles = await ArticleModel.find()
    //also findOne or findById
    res.send(articles)
  } catch (error) {
    next(error)
  }
})


//GET /articles/:id
articlesRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id
    const article = await ArticleModel.findById(id)
    if (article) {
      res.send(article)
    } else {
      const error = new Error()
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    console.log(error)
    next("While reading articles list a problem occurred!")
  }
})

//POST /articles
articlesRouter.post("/", async (req, res, next) => {
  try {
        const newArticle = new ArticleModel(req.body)
        const { _id } = await newArticle.save()
        res.status(201).send(_id)
  } catch (error) {
        next(error)
  }
})

//PUT articles/:id
articlesRouter.put("/:id", async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,  //new Parameters
      new: true,
    })
    if (article) {
      res.send(article)
    } else {
      const error = new Error(`article with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

//DELETE articles/:id
articlesRouter.delete("/:id", async (req, res, next) => {
  try {
    const article = await ArticleModel.findByIdAndDelete(req.params.id)
    if (article) {
      res.send("Deleted")
    } else {
      const error = new Error(`article with id ${req.params.id} not found`)
      error.httpStatusCode = 404
      next(error)
    }
  } catch (error) {
    next(error)
  }
})

 //GET /articles/:id/reviews => returns all the reviews for the specified article
articlesRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const article = await ArticleModel.findById(req.params.id, {
      reviews: 1,
      _id: 0,
    })
    res.send(article)
  } catch (error) {
    next(error)
  }
})

//POST /articles/:id => adds a new review for the specified article
articlesRouter.post("/:id/reviews", async (req, res, next) => {
  try { 
    /* const article = await ArticleModel.findByIdAndUpdate(
      id,
      {
        $push: { reviews: req.body },
      } */
    const reviewsArticle = await ArticleModel.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reviews: {
            ...req.body,
          },
        },
      }
    );
    res.status(201).send(reviewsArticle);
  
  } catch (error) {
    next(error)
  }
})

module.exports = articlesRouter