const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true }, // User's name
    comment: { type: String, required: true }, // The actual comment
    createdOn: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Comment', commentSchema);
