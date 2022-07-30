/** @format */

import express from "express"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"

const cloudinaryUploader = multer({
  storage: new CloudinaryStorage({
    cloudinary, // this searches in your process.env for something called CLOUDINARY_URL which contains your cloudinary api key and secret
    params: {
      folder: "netflixImages",
    },
  }),
  limits: { fileSize: 1024 * 1024 },
}).single("image")

const filesRouter = express.Router()

filesRouter.post("/cloudinary", cloudinaryUploader, async (req, res, next) => {
  try {
    console.log("REQ FILE: ", req.file)

    // 1. upload on Cloudinary happens automatically
    // 2. req.file contains the path which is the url where to find that picture
    // 3. update the resource by adding the path to it
    //res.send("UPLOADED")
    res.status(201).send({ url: req.file.path })
    //res.send()
  } catch (error) {
    next(error)
  }
})
export default filesRouter
