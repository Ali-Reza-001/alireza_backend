const Blog = require('../model/Blog');
const imageKit = require('../config/imageKitInit');
const User = require('../model/User');
const multer = require('multer');

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


const uploadBlog = async (req, res) => {
  upload.single('file')(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    const { category, title, content} = req.body;
    const file = req.file;
    
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }
    if (!category || !title || !content) {
        return res.status(400).json({ error: 'Category, title and content are required' });
    }

    try {

        const response = await imageKit.upload({
            file: req.file.buffer, // use buffer directly
            fileName: req.file.originalname,
            folder: "/blogImages",
            useUniqueFileName: true
        });

        console.log('ImageKit upload response:', response);

        const user = await User.findOne({ email: req.email });

        const newBlog = new Blog({
            category,
            title,
            content,
            authorID: user._id.toString(),
            imageUrl: response.url
        });

        await newBlog.save();

        res.status(200).json({message: 'Succeed'});
        
    } catch (uploadErr) {
        console.error(uploadErr);
        res.status(500).json({ error: "Uploading Failed." });
    }
  });

}

module.exports = uploadBlog;