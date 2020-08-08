const path = require('path');
const express = require('express');
const bodyParser = require("body-parser");
const mongoose = require("mongoose")

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

// if we are getting a cyclic dependency detected error, remove ?retryWrites=true&w=majority from out link to our back-end database.
mongoose.connect("mongodb+srv://sean:IWuVHUqrsPDNysYD@cluster0-tehq7.mongodb.net/node-angular",
{ useUnifiedTopology: true,
  useNewUrlParser: true })
  .then(() => {
    console.log('Connected to database!')
  })
  .catch(() => {
    console.log('Connection failed!')
  });

mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());
// we don't need this one below but it can be used to parse different kinds of body's
app.use(bodyParser.urlencoded({ extended: false}));
app.use("/images", express.static(path.join("backend/images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
  next();
});

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
