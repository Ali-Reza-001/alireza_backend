const sendEmail = require("../utils/mailer");

const officialEmail = (req, res) => {
    const {sender, subject, receiver, message} = req.body;
    if (!subject || !receiver || !message) return res.status(400).json({message: 'Something is missing.'});

    sendEmail({sender, subject, email: receiver, content: message});
    res.json({message: `Email successfully sent to ${receiver}`});
}

module.exports = officialEmail