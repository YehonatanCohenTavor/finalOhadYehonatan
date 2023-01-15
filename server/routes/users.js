var express = require('express');
var router = express.Router();
const fs = require('fs');
const adjustUserPath = require('../middlewares');

// /* GET users listing. */
router.get('/:username',adjustUserPath, function (req, res, next) {
  let userFiles = [];
  console.log(res.locals.path);
  fs.readdir(res.locals.path, (err, filesNames) => {
    filesNames.forEach((file,index) => {
      fs.stat(res.locals.path + `/${file}`, (err, stat) => {
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


router.post(`/:username`,adjustUserPath, ({ body }, res) => {
  if (body.type === 'file') {
    fs.appendFile(`${res.locals.path + '/' + body.name}`, `${ body.data }`, err => {
      if (err) console.log(err);
      console.log('File created');
      res.json(body);
    })
  }
  if (body.type === 'folder') {
    fs.mkdir(res.locals.path + '/' + body.name, err => {
      if (err) console.log(err);
      console.log('Directory created')
      res.json(body);
    })
  }
})

router.delete('/:username', adjustUserPath, ({body}, res) => {
  fs.rm(`${res.locals.path}/${body.name}`, { recursive: true }, err => {
    if (err) console.log(err);
    console.log('Item deleted');
    res.json(body);
    })
})

module.exports = router;

