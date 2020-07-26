const express = require('express')
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser')
const app = express()
const userRoutes = require('./routers/userRoutes')
const version = '/v1'
require("dotenv").config();
const config = require('./config/local');

//interact with MongoDB
const mongoose = require('mongoose');
//compose connection details
let dbConn = "mongodb://" + config.DB_USER+ ":" + config.DB_PASS + "@" + config.DB_HOST;
//connect to the database
mongoose.connect(dbConn, {useNewUrlParser: true}).then( () => {
	console.log('Connected to the database');
}).catch( err => {
	console.log('Error connecting to the database: ' + err);
	process.exit();
})

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(version, userRoutes)

module.exports = app
