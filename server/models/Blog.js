const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
    image: String,
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // Reference to Comment model
    createdOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Blog', BlogSchema);
