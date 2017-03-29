'use strict';

const express = require('express');
const humps = require('humps');
const bcrypt = require('bcrypt');
const boom = require('boom')
const knex = require('../knex')


// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/users', (req, res, next) => {
  console.log(req.body);
  // let fName = req.body.first_name;
  // if (!fName) {
  //   return next(boom.badRequest('First name must not be blank'))
  // }
  knex('users')
  .returning(['id', 'first_name', 'last_name', 'email'])
  .insert({
    first_name: req.body.firstName,
    last_name: req.body.lastName,
    email: req.body.email,
    hashed_password: bcrypt.hashSync(req.body.password, 8)
  })
  .then((user) =>{
    res.send(humps.camelizeKeys(user[0]))
  })
})

module.exports = router;
