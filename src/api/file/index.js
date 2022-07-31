/** @format */

import express from "express"
import multer from "multer"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { pipeline } from "stream"
import { createGzip } from "zlib"
import { getPDFReadableStream } from "../../lib/fs/pdf-tools.js"
import { getBooksReadableStream, getMedia } from "../../lib/fs/tools.js"

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

filesRouter.post("/:id/poster", cloudinaryUploader, async (req, res, next) => {
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

filesRouter.get("/productsJSON", (req, res, next) => {
  try {
    // SOURCES (file on disk, http request, ...) --> DESTINATIONS (file on disk, terminal, http response)

    // SOURCE (Readable Stream on books.json file) --> DESTINATION (http response)

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products.json.gz"
    ) // This header tells the browser to open the "save file on disk" dialog
    const source = getBooksReadableStream()
    const destination = res
    const transform = createGzip()

    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err)
    })
  } catch (error) {
    next(error)
  }
})
filesRouter.get("/:id/PDF", async (req, res, next) => {
  try {
    // SOURCE ( PDF Readable Stream) --> DESTINATION (http response)

    const products = await getMedia()

    res.setHeader("Content-Disposition", "attachment; filename=products.pdf")
    // const source = getPDFReadableStream(products)
    const source = getPDFReadableStream(products[0])
    const destination = res

    pipeline(source, destination, (err) => {
      if (err) console.log(err)
    })
  } catch (error) {
    next(error)
  }
})
export default filesRouter
