/** @format */

import fs from "fs-extra"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const mediasJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../data/movies.json"
)

export const getMedia = () => readJSON(mediasJSONPath)
export const writeMedia = (productsArray) =>
  writeJSON(mediasJSONPath, productsArray)
// export const saveProducts = (fileName, contentAsABuffer) =>
//   writeFile(join(productsPublicFolderPath, fileName), contentAsABuffer)
export const getBooksReadableStream = () => createReadStream(mediasJSONPath)
