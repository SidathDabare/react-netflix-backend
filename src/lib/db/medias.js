/** @format */

import uniqid from "uniqid"
import { getMedia, writeMedia } from "../fs/tools.js"

export const saveNewMedia = async (newMediaData) => {
  const medias = await getMedia()
  const newMedia = {
    ...newMediaData,
    createdAt: new Date(),
    imdbID: uniqid(),
    reviews: [],
  }
  medias.push(newMedia)
  await writeMedia(medias)

  return newMedia.imdbID
}

export const findMedia = async () => getMedia()

export const searchByType = async (str) => {
  const medias = await getMedia()
  //console.log(medias)
  if (str && medias) {
    const filterMedias = medias.filter(
      (media) => media.type.toLowerCase() === str.toLowerCase()
    )
    return filterMedias
  } else {
    //res.send(medias)
    return null
  }
}

export const findMediaById = async (mediaId) => {
  const medias = await getMedia()

  const foundMedia = medias.find((media) => media.imdbID === mediaId)

  return foundMedia
}

export const findMediaByIdAndUpdate = async (mediaId, updates) => {
  const medias = await getMedia()
  const index = medias.findIndex((media) => media.imdbID === mediaId)
  if (index !== -1) {
    medias[index] = {
      ...medias[index],
      ...updates,
      updatedAt: new Date(),
    }
    await writeMedia(medias)

    return medias[index]
  } else {
    // if index is -1 the product is not found
    return null
  }
}

export const findMediaByIdAndDelete = async (mediaId) => {
  const medias = await getMedia()
  const remainingMedia = medias.filter((media) => media.imdbID !== mediaId)

  if (medias.length === remainingMedia.length)
    throw createHttpError(404, `Product with id ${mediaId} not found!`)

  await writeMedia(remainingMedia)
}
