// mongoose is just a blueprint
const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imagePath: { type: String, required: true },
  // we added a reference below to the model so that each post has a user attached
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
});


module.exports = mongoose.model('Post', postSchema);
