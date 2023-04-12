const {comparePassword, checkUser} = require("../database");


async function checkToken(req, res, next) {
    // get cookie from request
    if (req.cookies.token === undefined || req.cookies.token === null)
        res.redirect('/login');
    else {
        let token = JSON.parse(req.cookies.token);
        if (await comparePassword(token.username, token.password) === false) {
            res.redirect('/login');
        } else {
            // add user_id to request

            req.user = await checkUser(token.username);
            next();
        }
    }
}

async function checkNotLogin(req, res, next) {
    if (req.cookies.token === undefined || req.cookies.token === null)
        next();
    else {
        let token = JSON.parse(req.cookies.token);
        if (await comparePassword(token.username, token.password) === false) {
            next();
        } else {
            res.redirect('/');
        }
    }
}
module.exports = {checkToken, checkNotLogin};
