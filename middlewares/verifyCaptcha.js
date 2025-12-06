import axios from "axios";

export const verifyCaptcha = async (req, res, next) => {
  try {
    const { captchaToken } = req.body;

    if (!captchaToken) {
      return res.status(400).json({ success: false, message: "CAPTCHA missing" });
    }

    const secret = process.env.RECAPTCHA_SECRET_KEY;

    const googleVerifyURL = `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${captchaToken}`;

    const response = await axios.post(googleVerifyURL);

    if (!response.data.success) {
      return res.status(400).json({
        success: false,
        message: "CAPTCHA verification failed"
      });
    }

    next();
  } catch (error) {
    console.error("reCAPTCHA Error:", error);
    return res.status(500).json({ success: false, message: "CAPTCHA server error" });
  }
};
