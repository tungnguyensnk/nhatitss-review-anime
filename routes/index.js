var express = require('express');
const {checkToken, checkNotLogin} = require("../middleware");
const {addPage, getPage, getComments, addComment, getAllPages, searchPage} = require("../database");
var router = express.Router();

/* GET home page. */
router.get('/', async (req, res, next) => {
    let pages = await getAllPages();
    res.render('home', {title: 'Web App', pages: pages});
});

router.get('/login', checkNotLogin, (req, res, next) => {

    res.render('login', {title: 'Express'});
});

router.get('/register', checkNotLogin, (req, res, next) => {
    res.render('register', {title: 'Express'});
});

router.get("/push", checkToken, (req, res, next) => {
    res.render('push', {title: 'Express'});
});

router.post("/push", checkToken, async (req, res, next) => {
    let page_id = await addPage(req.body.tenphim, req.body.noidung, req.user.id);

    // change file name
    let newName = __dirname + "/../public/files/" + page_id;
    if (req.files && req.files.file)
      await req.files.file.mv(newName);

    res.redirect("/show/" + page_id);
});

router.get("/show/:id", async (req, res, next) => {
    let page = await getPage(req.params.id);
    if(page === undefined)
        res.redirect("/");
    let comments = await getComments(req.params.id);
    res.render('show', {title: page.title, page: page, comments: comments});
});

router.post("/comment", checkToken, async (req, res, next) => {
    let page_id = req.body.page_id;
    let comment = req.body.comment;
    let user_id = req.user.id;
    await addComment(comment, user_id, page_id);
    res.redirect("/show/" + page_id);
});

router.post("/search", async (req, res, next) => {
    let pages = await searchPage(req.body.input);
    console.log(pages);
    res.json(pages);
});
module.exports = router;
