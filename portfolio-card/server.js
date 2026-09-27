const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Configure Nodemailer with your Gmail account
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abdiseid816@gmail.com', // Put your actual Gmail address here
    pass: 'tcrp icpc dkne ibbi'     // Paste your 16-character Google App Password here
  }
});

// Endpoint to receive contact form submissions
app.post('/api/contact', (req, res) => {
  const { sender_name, sender_email, message } = req.body;

  const mailOptions = {
    from: sender_email,
    to: 'abdiseid816@gmail.com', // Email destination (your inbox)
    subject: `New Portfolio Message from ${sender_name}`,
    html: `
      <h3>New Message Details</h3>
      <p><strong>Name:</strong> ${sender_name}</p>
      <p><strong>Email:</strong> ${sender_email}</p>
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    `
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ error: 'Failed to send message.' });
    }
    console.log('Email sent successfully:', info.response);
    res.status(200).json({ message: 'Message sent successfully to your Gmail!' });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});