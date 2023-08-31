try {
    const { name, email, subject, message } = req.body; // Added 'message' here
    if (!email || email.trim() === "") {
      return res.status(400).json({ error: "Email address is required." });
    }

    // Save the email to MongoDB
    const emailRecord = new Email({ name, email, subject, message }); // Added 'message' here
    await emailRecord.save();

    // Send the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USERNAME, // Use your Gmail email address
      to: "recipient@example.com", // Your email where you want to receive the message
      subject: subject,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`, // Added 'message' here
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
