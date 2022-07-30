/** @format */

import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"
import { findMediasReviewBySKU } from "../../lib/db/mediaReviews.js"

const mediaReviewSchema = {
  message: {
    isString: {
      errorMessage: "Message field cannot be empty!",
    },
  },
  rate: {
    isString: {
      errorMessage: "Rate field cannot be empty!",
    },
  },
  sku: {
    custom: {
      options: async (value) => {
        // search in db if that sku is already in there
        const media = await findMediasReviewBySKU(value)

        // if it is you have to reject
        if (media) return Promise.reject("SKU already in use!")
        // if it is not that's ok
        else return media
      },
    },
  },
}

const mediaReviewUpdateSchema = {
  message: {
    isString: {
      errorMessage: "Message field cannot be empty!",
    },
  },
  rate: {
    isString: {
      errorMessage: "Rate field cannot be empty!",
    },
  },
}

export const checksMediaReviewSchema = checkSchema(mediaReviewSchema)
export const checksMediaReviewUpdateSchema = checkSchema(
  mediaReviewUpdateSchema
)

export const checkValidationResult = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    next(
      createHttpError(400, `Media validation error!`, {
        errorsList: errors.array(),
      })
    )
  } else {
    next()
  }
}
