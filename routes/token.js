'use strict';

const express = require('express');
const humps = require('humps');
const bcrypt = require('bcrypt');
const boom = require('boom')
const knex = require('../knex')
const cookieSesh = require('cookie-session')
const jwt = require('jsonwebtoken');



const router = express.Router();

router.use(cookieSesh({
    name: 'session',
    keys: ['Gotham', 'Batman'],

    // Cookie Options
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

router.get('/token', (req, res, next) => {
    let token = req.cookies.token;
    console.log("token", token);
    if (!token) {
        console.log('tFalse', false);
        res.send(false)
    } else {
        console.log('tTrue', true);
        res.send(true)
    }

})

router.post('/token', (req, res, next) => {
    let email = req.body.email;
    if (!email || email === '') {
        return next(boom.badRequest('Email must not be blank'))
    }
    let password = req.body.password;
    if (!password || password === '') {
        return next(boom.badRequest('Password must not be blank'))
    } else {
        knex('users')
            .returning(['id', 'email', 'hashed_password'])
            .where('email', email)
            .then(emailz => {
                if (emailz.length === 0) {
                    return next(boom.badRequest('Bad email or password'))
                } else {
                    bcrypt.compare(password, emailz[0].hashed_password, (err, response) => {
                        if (!response) {
                            return next(boom.badRequest('Bad email or password'))
                        }
                        if (response) {
                            var token = jwt.sign({
                                loggedIn: true,
                                isAdmin: true
                            }, 'shhhh');

                            req.session.jwt = token;

                            res.cookie('token', token, {
                                httpOnly: true
                            });


                            delete emailz[0].hashed_password;
                            res.send(humps.camelizeKeys(emailz[0]))
                        }
                    })

                }
            })
    }
})

router.delete('/token', (req, res, next) => {

  res.cookie('token', "");
  res.end();

})


module.exports = router;
