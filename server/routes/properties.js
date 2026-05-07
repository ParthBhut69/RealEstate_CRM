const express = require('express');
const router = express.Router();
const propertiesController = require('../controllers/properties');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = path.join(__dirname, '../public/uploads/properties');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/', propertiesController.getAll);
router.get('/:id', propertiesController.getById);
router.post('/', upload.array('images', 10), propertiesController.create);
router.put('/:id', upload.array('images', 10), propertiesController.update);
router.delete('/:id', propertiesController.remove);

module.exports = router;
