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

const addPage = (title, body, user_id) => {
    return new Promise((resolve, reject) => {
        db.all('INSERT INTO pages (title, body, user_id) VALUES (?, ?, ?) returning id', [title, body, user_id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row[0].id);
            }
        });
    });
}

const getPage = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT p.*,u.username FROM pages p JOIN users u ON p.user_id = u.id WHERE p.id = ?', [id], (err, row) => {
            if (err) {
                reject(err);
            } else {
                resolve(row);
            }
        });
    });
}

const searchPage = (str) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM pages WHERE title LIKE ? OR body LIKE ?', ['%' + str + '%', '%' + str + '%'], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const addComment = (content, user_id, page_id) => {
    return new Promise((resolve, reject) => {
        db.run('INSERT INTO comments (content, user_id, page_id) VALUES (?, ?, ?)', [content, user_id, page_id], (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

const getComments = (page_id) => {
    return new Promise((resolve, reject) => {
        db.all('SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.id WHERE c.page_id = ?', [page_id], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

const getAllPages = () => {
    return new Promise((resolve, reject) => {
        db.all('SELECT p.*, u.username FROM pages p JOIN users u ON p.user_id = u.id', (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}
module.exports = {
    getUserById,
    checkUser,
    hashPassword,
    createUser,
    comparePassword,
    addPage,
    getPage,
    searchPage,
    addComment,
    getComments,
    getAllPages
};
