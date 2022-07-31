/** @format */

import PdfPrinter from "pdfmake"
import imageToBase64 from "image-to-base64"
import request from "request-promise-native"

import fs from "fs-extra"

// Define font files

export const getPDFReadableStream = (media) => {
  //let imageDataUrl = ""
  let imageToBase64 = async () => {
    let jpgDataUrlPrefix = "data:image/jpg;base64,"
    let imageUrl =
      "https://m.media-amazon.com/images/M/MV5BMTM5MzcwOTg4MF5BMl5BanBnXkFtZTgwOTQwMzQxMDE@._V1_SX300.jpg"

    request({
      url: imageUrl,
      method: "GET",
      encoding: null, // This is actually important, or the image string will be encoded to the default encoding
    }).then((result) => {
      let imageBuffer = Buffer.from(result)
      let imageBase64 = imageBuffer.toString("base64")
      let imageDataUrl = jpgDataUrlPrefix + imageBase64

      //console.log(imageDataUrl)
      return imageDataUrl
    })
  }
  imageToBase64()
  console.log("IMAGE: ", imageDataUrl)

  const fonts = {
    Roboto: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
    },
  }

  const printer = new PdfPrinter(fonts)

  const docDefinition = {
    content: [
      {
        text: `${media.title}`,
        style: "header",
      },
      {
        text: `${media.year}`,
        style: "header",
      },
      {
        text: `${media.type}`,
        style: "header",
      },

      {
        //image: imageDataUrl,
        // fit: [100, 100],
        // image: "./../../../Imges/Products/5151jIDBibL._AC_SX466_.jpg",
        // fit: [100, 100],
        // image:
        //   "https://m.media-amazon.com/images/I/41-a+qwZXgL._SX342_SY445_.jpg",
        // width: 150,
        // height: 150,
      },
    ],

    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      quote: {
        italics: true,
      },
      small: {
        fontSize: 8,
      },
    },
  }
  console.log("first", docDefinition)
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {})
  pdfReadableStream.end()

  return pdfReadableStream
}
