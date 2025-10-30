const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY); 

const sendEmail = async ({sender = 'admin@ali-reza.dev', subject, email, content}) => {
  const htmlContent = content.replace(/\n/g, '<br>');
  try {
    await resend.emails.send({ 
      from: sender, 
      to: email, 
      subject, 
      html: `<div style="font-family: Arial, sans-serif; font-size: 14px;">${htmlContent}</div>`
    });
  } catch (error) {
    console.error('Email send failed:', error);
    throw error;
  }

};


module.exports = sendEmail;