const multer = require('multer');
const path = require('path');
const fs = require('fs');
const imagekit = require('../config/imageKitInit');
const User = require('../model/User');

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'data', 'profilePics'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = Date.now() + ext;
    cb(null, name);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type'), false);
  }
};

const upload = multer({ storage, fileFilter });

const profilePic = (req, res, next) => {
  upload.single('selectedFile')(req, res, async (err) => {
    console.log(`Request email: ${req.email}`);
    console.log(`Request file: ${req.file}`);
    console.log(`Request err: ${err}`);
    console.log(`Request body: ${JSON.stringify(req.body)}`);
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const filePath = req.file.path;

    try {
      const response = await imagekit.upload({
        file: fs.readFileSync(filePath),
        fileName: req.file.filename,
        folder: "/profilePics",
        useUniqueFileName: true
      });

      console.log('ImageKit upload response:', response);

      const user = await User.findOne({ email: req.email });
      user.userProfilePic = `${response.url}?tr=w-512,h-512,f-webp`;
      await user.save();

      fs.unlinkSync(filePath); // Clean up local file

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