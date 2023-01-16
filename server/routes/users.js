var express = require('express');
var router = express.Router();
const fs = require('fs');
const { adjustUserPath } = require('../middlewares');


// /* GET All files. */
router.get('/:username', adjustUserPath, function (req, res) {
  let userFiles = [];
  console.log(res.locals.path);
  fs.readdir(res.locals.path, (err, filesNames) => {
    filesNames.forEach((file, index) => {
      fs.stat(res.locals.path + `/${file}`, (err, stat) => {
        userFiles.push({
          id: Math.random(),
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

//GET specific files
router.get('/:username/:folder?/:file', adjustUserPath, (req, res) => {
  fs.readFile(`${res.locals.path}/${(req.params.folder) || ''}/${req.params.file}`, 'utf8', (err, data) => {
    if (err) console.log(err);
    res.send(data);
  })
})

//POST a new file/directory

router.post(`/:username/:folder?`, adjustUserPath, (req, res) => {
  let path = `${res.locals.path}/${req.params.folder || ''}/${req.body.name}`;
  if (req.body.intention === 'copy') {
    if (req.body.type === 'file') {
      fs.copyFile(path, path + '-copy', (err) => {
        if (err) console.log(err);
        console.log("file copied");
        res.json(req.body);
      })
      return;
    } else {
      fs.mkdir(path + '-copy', err => {
        if (err) console.log(err);
        fs.readdir(path, (err, fileNames) => {
          fileNames.forEach((file, index) => {
            fs.copyFile(`${path}/${file}`, `${path + '-copy'}/${file}-copy`, err => {
              if (err) console.log(err);
              index === fileNames.length - 1 && res.json(req.body);
            })
          })
        })
      })
      return;
    }
  }
  if (req.body.type === 'file') {
    fs.appendFile(path, `${req.body.data}`, err => {
      if (err) console.log(err);
      console.log('File created');
      res.json(req.body);
    })
  }
  if (req.body.type === 'folder') {
    fs.mkdir(path, err => {
      if (err) console.log(err);
      console.log('Directory created')
      res.json(req.body);
    })
  }
})

//DELETE file/directory

router.delete('/:username/:folder?', adjustUserPath, (req, res) => {
  console.log(req.params);
  fs.rm(`${res.locals.path}/${req.params.folder || ''}/${req.body.name}`, { recursive: true }, err => {
    if (err) console.log(err);
    console.log('Item deleted');
    res.json(req.body);
  })
})

//PUT rename file or move file

router.put('/:username/:folder?', adjustUserPath, (req, res) => {
  if (req.body.intention === 'rename' || !req.body.intention) {
    fs.rename(`${res.locals.path}/${req.params.folder || ''}/${req.body.oldName}`,
      `${res.locals.path}/${req.params.folder || ''}/${req.body.newName}`,
      err => {
        if (err) console.log(err);
        console.log('File renamed!');
        res.json(req.body);
      })
  }
  if (req.body.intention === 'move') {
    fs.rename(`${res.locals.path}/${req.params.folder || ''}/${req.body.name}`,
    `${res.locals.path}/${req.body.destination}/${req.body.name}`,
    err => {
      if (err) console.log(err);
      console.log("File moved");
      res.json(req.body);
    })
  }
})


module.exports = router;

