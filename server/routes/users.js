var express = require('express');
var router = express.Router();
const fs = require('fs');

// /* GET users listing. */
router.get('/:username', function (req, res, next) {
  let userFiles = [];
  let currentPath = __dirname.split('/');
  currentPath.pop();
  currentPath.push(`files/${req.params.username}`);
  currentPath = currentPath.join('/')
  fs.readdir(currentPath, (err, filesNames) => {
    filesNames.forEach((file,index) => {
      fs.stat(currentPath + `/${file}`, (err, stat) => {
        userFiles.push({
          name: file,
          type: stat.isFile() ? "file" : "folder",
          birth: stat.birthtime,
          size: stat.size
        })
        index === filesNames.length - 1 && res.json(userFiles);
      }) 
    })
  });
});

// router.get('/', function (req, res, next) {
//   res.send('abc')
// })

module.exports = router;

