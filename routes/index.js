var express = require('express');
const {checkToken} = require("../middleware");
const {addPage, getPage, getComments, addComment, getAllPages} = require("../database");
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
    let pages = await getAllPages();
    res.render('home', {title: 'Web App', pages: pages});
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
    let name = req.files.file.name;
    let page_id = await addPage(req.body.tenphim, req.body.noidung, req.user_id);

    // change file name
    let newName = __dirname + "/../public/files/" + page_id;
    await req.files.file.mv(newName);

    res.redirect("/show/" + page_id);
});

router.get("/show/:id", async (req, res, next) => {
    let page = await getPage(req.params.id);
    let comments = await getComments(req.params.id);
    res.render('show', {title: page.title, page: page, comments: comments});
});

router.post("/comment", async (req, res, next) => {
    let page_id = req.body.page_id;
    let comment = req.body.comment;
    let user_id = req.body.user_id;
    await addComment(comment, page_id, user_id);
    res.redirect("/show/" + page_id);
});

router.get("/search", async (req, res, next) => {
    let pages = await getPage(req.query.search);
    res.json(pages);
});
module.exports = router;
