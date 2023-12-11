const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: { type: String, required: true },
    token: { type: String },
    date: { type: Date, default: Date.now }
});

UserSchema.plugin(mongoosePaginate);
const User = mongoose.model('User', UserSchema);
module.exports = { User }