import Contact from "../../models/contactModel.js";
import { sendEmail } from "../../utils/sendEmails.js"



export const sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: "All fields are required" });

    const newMsg = new Contact({ name, email, message });
    await newMsg.save();


    // Email to admin
    const adminMailSent = await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Contact Message Received",
      html: `
        <h2>New Message from Contact Form</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong> ${message}</p>
        <p><em>Login to admin panel to check details.</em></p>
      `
    });


    if (!adminMailSent) {
      return res.status(500).json({
        success: false,
        message: "Message saved but admin email failed"
      });
    }

    res.json({
      success: true,
      message: "Message sent successfully"
    });

  } catch (error) {
    console.error("Send Message Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while sending message"
    });
  }
};
