const Log = require("../model/Log");
const User = require("../model/User");

const userOnlineStatus = (socket) => {
    const ip = socket.handshake.address;
    const headers = socket.handshake.headers;
    const userAgent = headers['user-agent'];
    const device = userAgent.replace('(', '#').replace(')', '#').split('#')[1];
    const cookies = headers.cookie;

    const logUser = async (user) => {

        console.log('User is ' + user);

        if(user === '127.0.0.1' || user === '::1' || user === 'admin@admin.admin') {
            return;
        }

        try {
            const log = new Log({user, device, trip: [{method: 'GET', url: '/', timeElapsed: 0}]});
            await log.save();

            const logId = log._id.toString();
            console.log(`Socket triggered and created a log with id ${logId}`)

            socket.emit('userLogId', { userLogId: logId });
        } catch (err) {
            console.log(err);
        }

    }

    socket.on('user-online', async (data) => {

        const email = data.email;

        const user = email ? email : ip;
        logUser(user);

        if ( !email ) return;
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