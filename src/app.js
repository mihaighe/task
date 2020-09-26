const express = require('express')
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser');


const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
require('./db/mongoose')



const app = express()

app.use(express.json())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(userRouter)
app.use(taskRouter)

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

module.exports = app