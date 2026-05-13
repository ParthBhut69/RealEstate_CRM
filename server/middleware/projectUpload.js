const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage(); // Use memory storage for compression

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit (before compression)
  fileFilter: fileFilter
});

module.exports = upload;
