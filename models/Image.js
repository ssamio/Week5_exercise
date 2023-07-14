const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let imageSchema = new Schema({
    name: String,
    buffer: Buffer,
    encoding: String,
    mimetype: String
});

module.exports = mongoose.model("Image", imageSchema, "Images");