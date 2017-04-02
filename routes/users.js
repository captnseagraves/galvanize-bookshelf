'use strict';

const express = require('express');
const humps = require('humps');
const bcrypt = require('bcrypt');
const boom = require('boom')
const knex = require('../knex')
const cookieSesh = require('cookie-session')
const jwt = require('jsonwebtoken');


// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/users', (req, res, next) => {
    let email = req.body.email;
    if (!email || email === '') {
        return next(boom.badRequest('Email must not be blank'))
    }
    let password = req.body.password;
    if (!password || password === '') {
        return next(boom.badRequest('Password must be at least 8 characters long'))
    } else {
        knex('users')
            .returning(['email'])
            .where('email', email)
            .then(emailz => {
                if (emailz.length === 0) {
                    knex('users')
                        .returning(['id', 'first_name', 'last_name', 'email'])
                        .insert({
                            first_name: req.body.firstName,
                            last_name: req.body.lastName,
                            email: req.body.email,
                            hashed_password: bcrypt.hashSync(req.body.password, 8)
                        })
                        .then((user) => {
                          var token = jwt.sign({
                              loggedIn: true,
                              isAdmin: true
                          }, 'shhhh');

                          req.session.jwt = token;

                          res.cookie('token', token, {
                              httpOnly: true
                          });
                            res.send(humps.camelizeKeys(user[0]))
                        })
                } else {
                    return next(boom.badRequest('Email already exists'))

                }
            })
    }
})

module.exports = router;
