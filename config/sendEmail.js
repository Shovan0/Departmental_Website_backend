import nodemailer from 'nodemailer';

const sendEmail = async (email, subject, message) => {

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    console.log("Sending email...");

    await transporter.sendMail({
      from: process.env.MY_EMAIL,
      to: email,
      subject: subject,
      text: message
    });

};

export default sendEmail;