const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async (to, subject, text) => {
  await transporter.sendMail({
    from: '"Bakery App" <no-reply@bakeryapp.com>',
    to,
    subject,
    text,
  });
};
