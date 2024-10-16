const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // User's name
    image: { type: String, default:'' }, // User's image
    comment: { type: String, required: true }, // The actual comment
    createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);