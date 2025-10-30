const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY); 

const sendEmail = async ({sender = 'admin@ali-reza.dev', subject, email, content}) => {
  try {
    await resend.emails.send({ 
      from: sender, 
      to: email, 
      subject, 
      html: `<pre>${content}</pre>` 
    });
  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }

};


module.exports = sendEmail;