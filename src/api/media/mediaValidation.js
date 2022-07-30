/** @format */

import { checkSchema, validationResult } from "express-validator"
import createHttpError from "http-errors"
import { findMediasBySKU } from "../../lib/db/medias.js"

const mediaSchema = {
  title: {
    isString: {
      errorMessage: "Title field cannot be empty!",
    },
  },
  year: {
    isString: {
      errorMessage: "Year field cannot be empty!",
    },
  },
  poster: {
    isString: {
      errorMessage: "Poster field cannot be empty!",
    },
  },
  type: {
    isString: {
      errorMessage: "Type field cannot be empty!",
    },
  },
  //   type: {
  //     isDecimal: {
  //       errorMessage:
  //         "Price field cannot be empty and needs to be a valid decimal number!",
  //     },
  //   },
  //   type: {
  //     isIn: {
  //       options: [["action", "comady", "horror"]],
  //       errorMessage: "Category must be either action, comady or horror",
  //     },
  //   },
  sku: {
    custom: {
      options: async (value) => {
        // search in db if that sku is already in there
        const media = await findMediasBySKU(value)

        // if it is you have to reject
        if (media) return Promise.reject("SKU already in use!")
        // if it is not that's ok
        else return media
      },
    },
  },
}

const mediaUpdateSchema = {
  title: {
    isString: {
      errorMessage: "Title field cannot be empty!",
    },
  },
  year: {
    isString: {
      errorMessage: "Year field cannot be empty!",
    },
    optional: true,
  },
  poster: {
    isString: {
      errorMessage: "Poster field cannot be empty!",
    },
    optional: true,
  },
  type: {
    isString: {
      errorMessage: "Type field cannot be empty!",
    },
    optional: true,
  },
  //   type: {
  //     isDecimal: {
  //       errorMessage:
  //         "Price field cannot be empty and needs to be a valid decimal number!",
  //     },
  //   },
  //   type: {
  //     isIn: {
  //       options: [["action", "comady", "horror"]],
  //       errorMessage: "Category must be either action, comady or horror",
  //     },
  //   },
}

export const checksMediaSchema = checkSchema(mediaSchema)
export const checksMediaUpdateSchema = checkSchema(mediaUpdateSchema)

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
