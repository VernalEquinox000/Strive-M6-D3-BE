const express = require("express")
const cors = require("cors")
//const { join } = require("join")
const listEndPoints = require("express-list-endpoints")
const mongoose = require("mongoose")

const {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
} = require("./errorHandlers")

const server = express()

const port = process.env.PORT

const articlesRouter = require("./services/articles")

//const staticFolderPath = join(__dirname, "../public")
//server.use(express.static(staticFolderPath))
server.use(express.json())

server.use(cors())

server.use("/articles", articlesRouter)

// ERROR HANDLERS MIDDLEWARES
server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndPoints(server))

mongoose.connect(process.env.MONGO_CONNECTION)
    .then(server.listen(port, () => {
    console.log("Server running on port", port)
    }))
.catch(err => console.log(err))