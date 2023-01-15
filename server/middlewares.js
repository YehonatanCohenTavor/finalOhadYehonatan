const fs = require('fs');

function adjustUserPath(req, res, next) {
    let currentPath = __dirname;
    currentPath += `/files/${req.params.username}`;
    res.locals.path = currentPath;//home/hilma/Projects/OHADYEHONATAN/server/files/:username
    next();
}

function validateLogin(req, res, next) {
    fs.readFile(`${__dirname}/permissions.json`,'utf8', (err ,data)=> {
        if (err) console.log(err);
        let users = JSON.parse(data);
        let username = users.find(user => user.username === req.body.username);
        if (username && username.password === req.body.password) {
            next();
        } else {
            res.send('Login failed');
        }
    })
}

module.exports = { adjustUserPath, validateLogin };