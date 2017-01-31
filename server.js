const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {BlogPost} = require('./models');

const app = express();
app.use(bodyParser.json());

app.get('/posts', (req, res) => {
  BlogPost
    .find().then((posts) => {
      res.json({
        posts: posts.map(
          (post) => post.apiRepr())
        });
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
    });

app.get('/posts/:id', (req, res) => {
    var id = req.params.id;
    BlogPost
    .findById({_id: id}).then((post)=> {
      res.json(post.apiRepr());
    })
    .catch((err) => {
        console.error(err);
        res.status(500).json({message: 'Internal server error'});
      });
    });

app.post('/posts', (req, res) => {
      const requiredFields = ['title', 'content', 'author'];
      for (let i = 0; i < requiredFields.length; i ++) {
        const field = requiredFields[i];
        if(!(field in req.body)) {
          const message = `Missing ''${field}'' in request body`
          console.error(message);
          return res.status(400).send(message);
          }
        }
      var post = new BlogPost({
        title: req.body.title,
        content: req.body.content,
        author: {
          firstName: req.body.author.firstName,
          lastName: req.body.author.lastName
      }
    })
      res.send(post.apiRepr());
  });

  app.put('/posts/:id', (req, res) => {
      let id = req.params.id;
      // if (!req.body.id.length) {
      //     const message = `Missing id in request body`
      //     console.error(message);
      //     return res.status(400).send(message);
      //     }
      //
      // if (req.params.id !== req.body.id) {
      //     const message =
      //       `Request path id ${id} and request body id
      //       ${req.body.id} must match`;
      //     console.error(message);
      //     return res.status(400).send(message);
      //   }

      BlogPost
        .findByIdAndUpdate(
          {id},
          {"title": req.body.title,
          "content": req.body.content,
          "author": req.body.author
        }, (req, res) => {
          console.log(`Updating blog post ${req.params.id}`);
          res.status(200)
          .send(res.body);
        })
        .catch(e) => console.error(e);
    });

let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
     return new Promise((resolve, reject) => {
       console.log('Closing server');
       server.close(err => {
           if (err) {
               return reject(err);
           }
           resolve();
       });
     });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

module.exports = {app, runServer, closeServer};
