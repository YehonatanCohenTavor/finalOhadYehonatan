function adjustUserPath(req, res, next) {
    let currentPath = __dirname;
    currentPath += `/files/${req.params.username}`;
    res.locals.path = currentPath;
    next();
}

module.exports = adjustUserPath;