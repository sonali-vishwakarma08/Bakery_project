const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465, false for others
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"Bakery Shop" <${process.env.SMTP_USER}>`,
    to,
    subject,
    text
  });
};

module.exports = sendEmail;
