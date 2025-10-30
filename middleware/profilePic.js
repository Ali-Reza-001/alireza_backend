const multer = require('multer');
const imagekit = require('../config/imageKitInit');
const User = require('../model/User');

// Configure memory storage
const storage = multer.memoryStorage();

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ storage, fileFilter });

const profilePic = (req, res, next) => {
  upload.single('selectedFile')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
      const response = await imagekit.upload({
        file: req.file.buffer, // use buffer directly
        fileName: req.file.originalname,
        folder: "/profilePics",
        useUniqueFileName: true
      });

      console.log('ImageKit upload response:', response);

      const user = await User.findOne({ email: req.email });
      user.userProfilePic = `${response.url}`;
      await user.save();

      res.status(200).json({
        message: "Your image uploaded successfully",
        url: response.url,
        fileId: response.fileId
      });
    } catch (uploadErr) {
      console.error(uploadErr);
      res.status(500).json({ error: "ImageKit upload failed" });
    }
  });
};

module.exports = profilePic;