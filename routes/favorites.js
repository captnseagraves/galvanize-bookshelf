'use strict';

const express = require('express');
const humps = require('humps');
const bcrypt = require('bcrypt');
const boom = require('boom')
const knex = require('../knex')
const cookieSesh = require('cookie-session')
const jwt = require('jsonwebtoken');



const router = express.Router();

router.get('/favorites', (req, res, next) => {
  console.log('else');
    knex('favorites')
        .join('books', 'favorites.book_id', '=', 'books.id')
        .then(favs => {
            res.send(humps.camelizeKeys(favs))
        })
})

router.get('/favorites/check?bookId=1', (req, res, next) => {
console.log('something');
    // knex('favorites')
    //     .join('books', 'favorites.book_id', '=', 'books.id')
    //     .where('books.id', 1)
    //     .then(favs => {
    //         res.send(humps.camelizeKeys(favs))
    //     })
})



module.exports = router;
