const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Enhanced email function with HTML support
module.exports = async (to, subject, text, html = null) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Bakery App" <no-reply@bakeryapp.com>',
    to,
    subject,
    text,
  };

  // Add HTML version if provided
  if (html) {
    mailOptions.html = html;
  }

  await transporter.sendMail(mailOptions);
};

// Specialized function for notification emails
module.exports.sendNotificationEmail = async (user, notification) => {
  const subject = notification.title;
  const text = `${notification.title}

${notification.message}

This is an automated notification from Bakery App.`;
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${notification.title}</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #D9526B 0%, #F2BBB6 100%); padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">Bakery App Notification</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #eee; border-top: none; border-radius: 0 0 10px 10px;">
          <h2 style="color: #D9526B;">${notification.title}</h2>
          <p>${notification.message}</p>
          <div style="margin-top: 30px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #D9526B;">
            <p><strong>Note:</strong> You received this email because you are subscribed to Bakery App notifications. 
            You can manage your notification preferences in your account settings.</p>
          </div>
          <div style="margin-top: 30px; text-align: center; color: #777; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Bakery App. All rights reserved.</p>
            <p>This is an automated message, please do not reply.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await module.exports(user.email, subject, text, html);
};