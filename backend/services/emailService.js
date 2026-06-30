const nodemailer = require('nodemailer');

// Mock email service for account lockouts.
// If you have a real SMTP server, configure the transport here.
const sendLockoutEmail = async (email) => {
  try {
    console.log(`[Email Service] Simulating sending lockout email to ${email}...`);
    
    // Example of how you would configure nodemailer when you have SMTP credentials:
    /*
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: '"Security Bot" <security@mr-tracker.com>',
      to: email,
      subject: "Security Alert: Account Locked due to too many failed login attempts",
      text: "Your account has been temporarily locked for 15 minutes due to multiple failed login attempts. If this was not you, please reset your password immediately.",
      html: "<p>Your account has been temporarily locked for 15 minutes due to multiple failed login attempts.</p><p>If this was not you, please reset your password immediately using the link below:</p><p><a href='https://mr-tracker.com/reset-password'>Reset Password</a></p>",
    });
    console.log("Message sent: %s", info.messageId);
    */

    console.log(`[Email Service] Lockout email successfully 'sent' to ${email}.`);
  } catch (error) {
    console.error(`[Email Service Error] Failed to send email to ${email}:`, error);
  }
};

module.exports = {
  sendLockoutEmail
};
