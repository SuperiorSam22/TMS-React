const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // or 'STARTTLS'
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
});

console.log(transporter.options.auth);

module.exports = transporter;