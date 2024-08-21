const multer = require('multer');

// Configure multer for image upload

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Specify the upload directory
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.originalname); // Customize the filename
    }
  });
  
  const upload = multer({ storage: storage });

module.exports = upload;
