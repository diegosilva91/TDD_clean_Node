const express = require('express')
const api = express.Router()
const mongoose = require('mongoose');
//import User
const Books = require('../models/books');
const checkAuth = require('../middleware/check-auth');

api.get('/books', checkAuth, (req, res, next) => {
    Books.find({}).then((founds, err) => {
        if (!founds && err) {
            //return error, user is not registered
            res.status(401).json({
                message: 'Error to find books',
                errors: err
            });
        } else if(founds.length===0){
            res.status(200).json({
                message:'There are no books in the library',
                books: founds,
                errors: [],
            })
        } 
        else {
            res.status(200).json({
                message:'',
                books: founds,
                errors: [],
            })
        }
    })
})
module.exports = api