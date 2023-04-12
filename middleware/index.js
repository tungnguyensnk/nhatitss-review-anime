const {comparePassword} = require("../database");


async function checkToken(req, res, next) {
    // get cookie from request
    let token = JSON.parse(req.cookies.token);
    if (token === undefined || token === null || await comparePassword(token.username,token.password) === false) {
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports = {checkToken};