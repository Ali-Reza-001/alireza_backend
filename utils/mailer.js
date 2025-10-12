
module.exports = sendEmail;
const { Resend } = require('resend');
const DOMAIN = require('../config/DOMAIN');

const resend = new Resend(process.env.RESEND_API_KEY); 


const sendEmail = async (email, content) => {
  await resend.emails.send({
    from: '<admin@ali-reza.dev>', // Cutomizable sender email
    to: email,
    subject: 'Verify your email',
    html: content
  });
};


module.exports = sendEmail;