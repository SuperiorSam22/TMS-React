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

  const fileFilter = (req, file, cb) => {
    cb(null, true); // Allow files of any type
  };
  
  // const upload = multer({ storage: storage });
  const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 5 // Set file size limit to 5MB (optional)
    }
  });

module.exports = upload;
