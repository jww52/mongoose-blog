const mongoose = require('mongoose');

const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true}
  },
  created: {type: Number, required: false}
});

blogPostSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()});

blogPostSchema.methods.apiRepr = function() {

  return {
    id: this._id,
    title: this.title,
    author: this.authorString,
    content: this.content,
    created: this.createdDate || Date.now()
  }
};

const BlogPost = mongoose.model('Posts', blogPostSchema);

module.exports = {BlogPost};
