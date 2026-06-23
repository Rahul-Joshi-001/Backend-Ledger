const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Verify the connection configuration
// transporter.verify((error, success) => {
//   if (error) {
//     console.error("Error connecting to email server:", error);
//   } else {
//     console.log("Email server is ready to send messages");
//   }
// });

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Backend Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

async function sendRegistrationEmail(userEmail, name) {
  const subject = "Welcome to Backend Ledger!";

  const text = `Hello ${name},

Thank you for registering at Backend Ledger.
We're excited to have you on board!

Best regards,
The Backend Ledger Team`;

  const html = `<p>Hello ${name},</p>
<p>Thank you for registering at Backend Ledger. We're excited to have you on board!</p>
<p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransaction(userEmail, name, amount, toAccount) {
  const subject = "Transaction Successful 💸";

  const text = `Hello ${name},

    Your transaction has been successfully processed.

    Amount Sent: ₹${amount}
    To Account: ${toAccount}

    If you did not perform this transaction, please contact support immediately.

    Best regards,
    The Backend Ledger Team`;

  const html = `<p>Hello ${name},</p>

    <p>Your transaction has been successfully processed.</p>

    <p><strong>Amount Sent:</strong> ₹${amount}<br>
    <strong>To Account:</strong> ${toAccount}</p>

    <p>If you did not perform this transaction, please contact support immediately.</p>

    <p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailure(userEmail, name, amount, toAccount) {
  const subject = "Transaction Failed ❌";

  const text = `Hello ${name},

    We regret to inform you that your recent transaction could not be completed.

    Amount Attempted: ₹${amount}
    To Account: ${toAccount}

    Please check your account details or try again later.

    If the issue persists, contact our support team.

    Best regards,
    The Backend Ledger Team`;

  const html = `<p>Hello ${name},</p>

    <p>We regret to inform you that your recent transaction could not be completed.</p>

    <p><strong>Amount Attempted:</strong> ₹${amount}<br>
    <strong>To Account:</strong> ${toAccount}</p>

    <p>Please check your account details or try again later.</p>

    <p>If the issue persists, contact our support team.</p>

    <p>Best regards,<br>The Backend Ledger Team</p>`;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = {
  sendRegistrationEmail,
  sendTransaction,
  sendTransactionFailure,
};
