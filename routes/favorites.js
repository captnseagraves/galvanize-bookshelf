'use strict';

const express = require('express');
const humps = require('humps');
const bcrypt = require('bcrypt');
const boom = require('boom')
const knex = require('../knex')
const cookieSesh = require('cookie-session')
const jwt = require('jsonwebtoken');



const router = express.Router();

const auth = (req, res, next) => {
    if (!req.cookies.token) {
        return next(boom.unauthorized('Unauthorized'))
    } else {
        next()
    }
}

router.get('/favorites', auth, (req, res, next) => {
    knex('favorites')
        .join('books', 'favorites.book_id', '=', 'books.id')
        .then(favs => {
            res.send(humps.camelizeKeys(favs))
        })
})

router.get('/favorites/:bookId', auth, (req, res, next) => {
    let bookId = Number(req.query.bookId)

    if (typeof bookId !== 'number' || Number.isNaN(bookId)) {
        return next(boom.badRequest('Book ID must be an integer'))
    }

    knex('favorites')
        .join('books', 'favorites.book_id', '=', 'books.id')
        .where('books.id', bookId)
        .then(favs => {
            if (favs.length === 0) {
                return res.send(false)
            } else {
                return res.send(true)
            }
        })
})

router.post('/favorites', auth, (req, res, next) => {
    let bookId = req.body.bookId;
    if (typeof bookId !== 'number') {
        return next(boom.badRequest('Book ID must be an integer'))
    }
    knex('books')
        .where('id', bookId)
        .then(books => {
            if (books.length === 0) {
                return next(boom.notFound('Book not found'))
            } else {
                knex('favorites')
                    .returning(['id', 'book_id', 'user_id'])
                    .insert({
                        'book_id': bookId,
                        'user_id': 1
                    })
                    .then(stuff => {
                        res.send(humps.camelizeKeys(stuff[0]))
                    })
            }
        })
})

router.delete('/favorites', auth, (req, res, next) => {
    let bookId = req.body.bookId;
    if (typeof bookId !== 'number') {
        return next(boom.badRequest('Book ID must be an integer'))
    }
    knex('books')
        .where('id', bookId)
        .then(books => {
            if (books.length === 0) {
                return next(boom.notFound('Favorite not found'))
            } else {
                knex('favorites')
                    .returning(['book_id', 'user_id'])
                    .del()
                    .where('book_id', bookId)
                    .then(stuff => {
                        res.send(humps.camelizeKeys(stuff[0]))
                    })
            }
        })
})



module.exports = router;
