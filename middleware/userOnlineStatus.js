const jwt = require("jsonwebtoken");
const User = require("../model/User");

const userOnlineStatus = (socket) => {
    socket.on('user-online', async (data) => {
        const accessToken = data.accessToken;
        const decoded = jwt.decode(accessToken); 
        const email = decoded?.email || 'Unknown';
        if ( email === 'Unknown') return;
        console.log(`User ${email} is online`);

        try {
            await User.findOneAndUpdate({ email }, { isOnline: true }, {new: true});
            socket.data.email = email; 
        } catch (err) {
            console.log(err)
        }
    });

    socket.on('disconnect', async () => {
        const email = socket.data?.email;
        if (!email) return;

        console.log(`User ${email} disconnected`);

        try {
            await User.findOneAndUpdate({ email }, { isOnline: false }, {new: true});
        } catch (err) {
            console.log('Error marking user offline:', err);
        }
    });
}

module.exports = userOnlineStatus;