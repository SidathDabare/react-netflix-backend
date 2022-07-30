/** @format */

import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import mediaRouter from "./api/media/index.js"
import filesRouter from "./api/file/index.js"
import {
  badRequestHandler,
  genericErrorHandler,
  notFoundHandler,
} from "./errorsHandlers.js"
import createHttpError from "http-errors"

const server = express()
const port = process.env.PORT || 3001

// ***************************************** ERROR HANDLERS ************************************
// const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL]

// server.use(
//   cors({
//     origin: (origin, corsNext) => {
//       // If you want to connect FE to this BE you must use cors middleware
//       console.log("ORIGIN: ", origin)

//       if (!origin || whitelist.indexOf(origin) !== -1) {
//         // if origin is in the whitelist we can move next
//         corsNext(null, true)
//       } else {
//         // if origin is NOT in the whitelist --> trigger an error
//         corsNext(
//           createHttpError(
//             400,
//             `Cors Error! Your origin ${origin} is not in the list!`
//           )
//         )
//       }
//     },
//   })
// )
// ******************************************* MIDDLEWARES *************************************

server.use(cors())
server.use(express.json())
// ****************************************** ENDPOINTS ****************************************
server.use("/medias", mediaRouter)
server.use("/file", filesRouter)

// ***************************************** ERROR HANDLERS ************************************
server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

server.listen(port, () => {
  console.table(listEndpoints(server))
  console.log(`Server is listening on port ${port}`)
})
