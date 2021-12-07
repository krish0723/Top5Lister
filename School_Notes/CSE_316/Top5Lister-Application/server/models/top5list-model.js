const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Top5ListSchema = new Schema(
    {
        name: { type: String, required: true },
        items: { type: [String], required: true },
        ownerEmail: { type: String },
        likes: { type: Number, default: 0 },
        dislikes:{ type: Number, default: 0 },
        views:{ type: Number, default: 1},
        comments: { type: [String]},
        published: {type: Boolean, default: false}
    },
    { timestamps: true },
)

module.exports = mongoose.model('Top5List', Top5ListSchema)
