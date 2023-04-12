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
            req.user_id = await checkUser(token.username).id;
            console.log(req.user_id);
            next();
        }
    }
}

module.exports = {checkToken};
