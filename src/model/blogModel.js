const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    post: {
        type: String,
        required: true
    },
    author: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now }
});
blogSchema.plugin(mongoosePaginate);
const Blog = mongoose.model('Blog', blogSchema);
module.exports = { Blog }