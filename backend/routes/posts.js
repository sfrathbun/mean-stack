const express = require('express');

// npm install --save multer (this is used to extract files)
const multer = require('multer');

const Post = require('../models/post');
const checkAuth = require("../middleware/check-auth");  // this is our middleware to check for authorization

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    // we created an images folder in the backend telling multer where to write
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});


// MongoDB database access. Username: sean, Password: IWuVHUqrsPDNysYD

router.post(
  "",
  checkAuth, // we're checking our authorization before we even try to run the multer to extract the image
  multer({ storage: storage }).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId // this grabs the user data and saves it to the post
  });
  post.save().then(createdPost => {
    console.log(createdPost);
    res.status(201).json({
      message: "post added successfully!",
      post: {
        // instead you can use the spread operator like below and override some properties such as the id
        ...createdPost,
        id: createdPost._id
        // id: createdPost._id,
        // title: createdPost.title,
        // content: createdPost.content,
        // imagePath: createdPost.imagePath
      }
    });
  });
});

router.put(
  "/:id",
  checkAuth,
multer({ storage: storage }).single("image"),
(req, res, next) => {
  let imagePath = req.body.imagePath;
  if (req.file) {
    const url = req.protocol + '://' + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  };
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath
  });
  console.log(post);
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({ message: "Update Successful!" });
  });
});

router.get("", (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize);
  }
  postQuery
    .then(documents => {
      fetchedPosts = documents
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: 'posts fetched successfully!',
        posts: fetchedPosts,
        maxPosts: count
       });
     });
  });

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  })
});

router.delete("/:id", checkAuth, (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
  })
  res.status(200).json({ message: "Post Deleted!" });
})

module.exports = router;
