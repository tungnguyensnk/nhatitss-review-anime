var express = require('express');
var router = express.Router();
const db = require('../database');
const {hashPassword} = require("../database");

router.post('/login', async function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let user = await db.comparePassword(username, password);
    if (user) {
        res.json({status: 'success', message: 'Login successful', username: username, password: password});
    } else {
        res.json({status: 'error', message: 'Login failed'});
    }
});

router.post('/register', async function (req, res) {
    let username = req.body.username;
    let password = hashPassword(req.body.password);
    let user = await db.checkUser(username);
    if (user) {
        res.json({status: 'error', message: 'Username already exists'});
    } else {
        await db.createUser(username, password);
        res.json({status: 'success', message: 'Registration successful'});
    }
});
module.exports = router;
