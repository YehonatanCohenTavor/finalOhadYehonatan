var express = require('express');
var router = express.Router();
const {validateLogin} = require('../middlewares');


router.post('/', validateLogin,function({body}, res, next) {
  res.send(body.username);
});

module.exports = router;
