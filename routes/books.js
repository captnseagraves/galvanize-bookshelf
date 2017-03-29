'use strict';

const express = require('express');
const knex = require('../knex');
const humps = require('humps');
const boom = require('boom')

const router = express.Router();

router.get("/books", (req, res, next) => {
  knex("books")
  .orderBy("title", "asc")
    .then((books) => {
      res.send(humps.camelizeKeys(books));
    });
});
router.get("/books/:id", (req, res, next) => {
  let id = req.params.id
  if (id !== 'id') {
     return res.status(404)
               .set('Content-Type', 'text/plain')
               .send('Not Found')
   }
  knex("books")
  .where("id", req.params.id)
  .then((book) => {
    res.send(humps.camelizeKeys(book[0]));
  });
});

router.post('/books', (req, res, next) => {
  let title = req.body.title;
  if (!title) {
     return res.status(400)
               .set('Content-Type', 'text/plain')
               .send('Title must not be blank')
   };
   let author = req.body.author;
   if (!author) {
      return res.status(400)
                .set('Content-Type', 'text/plain')
                .send('Author must not be blank')
    };
    let genre = req.body.genre;
    if (!genre) {
       return res.status(400)
                 .set('Content-Type', 'text/plain')
                 .send('Genre must not be blank')
     };
     let description = req.body.description;
     if (!description) {
        return res.status(400)
                  .set('Content-Type', 'text/plain')
                  .send('Description must not be blank')
      };
      let coverUrl = req.body.coverUrl;
      if (!coverUrl) {
         return res.status(400)
                   .set('Content-Type', 'text/plain')
                   .send('Cover URL must not be blank')
       };
  knex('books')
  .returning('*')
  .insert(humps.decamelizeKeys(req.body))
  .then((book) =>{
    res.send(humps.camelizeKeys(book[0]))
  })
})

router.patch('/books/:id', (req, res, next) => {
  let id = req.params.id
  if (id !== 'id') {
    return next(boom.notFound('Not Found'));
   }
  knex('books')
  .returning('*')
  .update(humps.decamelizeKeys(req.body))
  .then((book) =>{
    res.send(humps.camelizeKeys(book[0]))
  })
})

router.delete('/books/:id', (req, res, next) => {
  let id = req.params.id
  if (id !== 'id') {
     return res.status(404)
               .set('Content-Type', 'text/plain')
               .send('Not Found')
   }
  knex('books')
  .returning(['title', 'author', 'genre', 'description', 'cover_url'])
  .del(humps.decamelizeKeys(req.body))
  .then((book) =>{
    res.send(humps.camelizeKeys(book[0]))
  })
})

// router.get('/books', (res, req, next) => {
//   knex('books')
//   .then(book)
//   res.send(humps.camelizeKeys(book[0]))
// })
//

module.exports = router;
