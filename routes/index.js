var express = require('express');
const {checkToken} = require("../middleware");
var router = express.Router();

/* GET home page. */
router.get('/', checkToken, (req, res, next) => {
    res.render('home', {title: 'Express'});
});

router.get('/login', (req, res, next) => {
    res.render('login', {title: 'Express'});
});

router.get('/register', (req, res, next) => {
    res.render('register', {title: 'Express'});
});

router.get("/push", checkToken, (req, res, next) => {
    res.render('push', {title: 'Express'});
});

router.post("/push", checkToken, async (req, res, next) => {
    // show info
    console.log(req.body);
    console.log(req.files);
    let path = req.files.file.tempFilePath;
    let name = req.files.file.name;

    // change file name
    let newName = __dirname + "/../public/files/" + name;
    await req.files.file.mv(newName);

    res.json({status: 'success', message: 'File uploaded'});
});
module.exports = router;
