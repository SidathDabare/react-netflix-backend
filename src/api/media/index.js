/** @format */

import express from "express"
import createHttpError from "http-errors"
import {
  findReviewById,
  findReviewByIdAndDelete,
  findReviewByIdAndUpdate,
  saveNewReview,
} from "../../lib/db/mediaReviews.js"
import {
  saveNewMedia,
  findMediaById,
  findMedia,
  findMediaByIdAndUpdate,
  findMediaByIdAndDelete,
  searchByType,
} from "../../lib/db/medias.js"

const mediaRouter = express.Router()

mediaRouter.post("/", async (req, res, next) => {
  try {
    const imbdID = await saveNewMedia(req.body)
    res.status(201).send({ imbdID })
  } catch (error) {
    next(error)
  }
})

mediaRouter.get("/", async (req, res, next) => {
  try {
    const medias = await findMedia()
    res.send(medias)
  } catch (error) {
    next(error)
  }
})
mediaRouter.get("/search", async (req, res, next) => {
  try {
    const media = await searchByType(req.query.type)
    if (media) {
      res.send(media)
    } else {
      next(createHttpError(404, `Product with id  not found!`))
    }
  } catch (error) {
    next(error)
  }
})

mediaRouter.get("/:id", async (req, res, next) => {
  try {
    const media = await findMediaById(req.params.id)
    if (media) {
      res.send(media)
    } else {
      next(createHttpError(404, `Product with id ${req.params.id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

mediaRouter.put("/:id", async (req, res, next) => {
  try {
    const product = await findMediaByIdAndUpdate(req.params.id, req.body)
    if (product) {
      res.send(product)
    } else {
      next(createHttpError(404, `Product with id ${req.params.id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

mediaRouter.delete("/:id", async (req, res, next) => {
  try {
    await findMediaByIdAndDelete(req.params.id)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

// Meedia  Reviews------------------

mediaRouter.post("/:id/reviews", async (req, res, next) => {
  try {
    const updatedMedia = await saveNewReview(req.params.id, req.body)
    if (updatedMedia) {
      res.send(updatedMedia)
    } else {
      next(createHttpError(404, `Product with id ${req.params.id} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

mediaRouter.get("/:id/reviews", async (req, res, next) => {
  try {
    const { reviews } = await findMediaById(req.params.id)
    res.send(reviews)
  } catch (error) {
    next(error)
  }
})

mediaRouter.get("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const review = await findReviewById(req.params.id, req.params.reviewId)
    if (review) {
      res.send(review)
    } else {
      next(
        createHttpError(404, `Review with id ${req.params.reviewId} not found!`)
      )
    }
  } catch (error) {
    next(error)
  }
})

mediaRouter.put("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    const updatedReview = await findReviewByIdAndUpdate(
      req.params.id,
      req.params.reviewId,
      req.body
    )
    res.send(updatedReview)
  } catch (error) {
    next(error)
  }
})

mediaRouter.delete("/:id/reviews/:reviewId", async (req, res, next) => {
  try {
    await findReviewByIdAndDelete(req.params.id, req.params.reviewId)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})
export default mediaRouter
