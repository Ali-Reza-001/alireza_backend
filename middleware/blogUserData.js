const User = require("../model/User");

const blogUserData = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId).select('username userProfilePic');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = blogUserData;