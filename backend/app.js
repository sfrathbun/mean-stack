const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

const Post = require('./models/posts')

const app = express();

mongoose.connect("mongodb+srv://sean:IWuVHUqrsPDNysYD@cluster0-tehq7.mongodb.net/node-angular?retryWrites=true&w=majority")
  .then(() => {
    console.log('Connected tp database!')
  })
  .catch(() => {
    console.log('Connection failed!')
  });

app.use(bodyParser.json());
// we don't need this one below but it can be used to parse different kinds of body's
app.use(bodyParser.urlencoded({ extended: false}));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, DELETE, OPTIONS"
    );
  next();
});

// MongoDB database access. Username: sean, Password: IWuVHUqrsPDNysYD

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save();
  res.status(201).json({
    message: "post added successfully!"
  })
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'posts fetched successfully!',
      posts: documents
    });
  });
});

module.exports = app;
