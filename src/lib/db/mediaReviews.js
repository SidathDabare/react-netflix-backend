/** @format */

import createHttpError from "http-errors"
import uniqid from "uniqid"
import { getMedia, writeMedia } from "../fs/tools.js"
import { findMediaById } from "./medias.js"

export const saveNewReview = async (imdbID, newReviewData) => {
  const medias = await getMedia()
  const index = medias.findIndex((media) => media.imdbID === imdbID)
  if (index !== -1) {
    medias[index].reviews.push({
      ...newReviewData,
      reviewId: uniqid(),
      createdAt: new Date(),
    })
    await writeMedia(medias)

    return medias[index]
  } else {
    // if index is -1 the product is not found
    return null
  }
}

export const findReviewById = async (imdbID, reviewId) => {
  const { reviews } = await findMediaById(imdbID)

  const foundReview = reviews.find((review) => review.id === reviewId)

  return foundReview
}

export const findReviewByIdAndUpdate = async (imbdID, reviewId, updates) => {
  const medias = await getMedia()
  const index = medias.findIndex((media) => media.imdbID === imbdID)
  if (index !== -1) {
    const reviewIndex = medias[index].reviews.findIndex(
      (review) => review.reviewId === reviewId
    )
    if (reviewIndex !== -1) {
      medias[index].reviews[reviewIndex] = {
        ...medias[index].reviews[reviewIndex],
        ...updates,
        updatedAt: new Date(),
      }

      await writeMedia(medias)
      return medias[index].reviews[reviewIndex]
    } else {
      throw new createHttpError(404, `Review with id ${reviewId} not found!`)
    }
  } else {
    throw new createHttpError(404, `Product with id ${productId} not found!`)
  }
}

export const findReviewByIdAndDelete = async (imdbID, reviewId) => {
  const medias = await getMedia()
  const index = medias.findIndex((media) => media.imdbID === imdbID)
  if (index !== -1) {
    const reviewIndex = medias[index].reviews.findIndex(
      (review) => review.reviewId === reviewId
    )
    if (reviewIndex !== -1) {
      medias[index].reviews = medias[index].reviews.filter(
        (review) => review.reviewId !== reviewId
      )
      await writeMedia(medias)
    } else {
      throw new createHttpError(404, `Review with id ${reviewId} not found!`)
    }
  } else {
    throw new createHttpError(404, `Product with id ${imdbID} not found!`)
  }
}
