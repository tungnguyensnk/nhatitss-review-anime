const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(__dirname + '/db.sqlite');
const bcrypt = require('bcrypt');

//get user by id
const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

const checkUser = (username) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

const createUser = (username, password) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
const hashPassword = (password) => {
    return bcrypt.hashSync(password, 10);
}

const comparePassword = (username, password) => {
    console.log(username, password);
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
            if (err) {
                reject(err);
            } else {
                row ??= {password: ''};
                bcrypt.compare(password, row.password, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            }
        });
    });
}
module.exports = {getUserById, checkUser, hashPassword, createUser, comparePassword};