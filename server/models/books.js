const mongoose = require('mongoose');
const booksSchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
    title: {type: String, required: true},
    author: {type: String, required: true},
}, 
{
	timestamps: true
});

module.exports = mongoose.model('Book', userSchema, 'books');