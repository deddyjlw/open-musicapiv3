const nodemailer = require('nodemailer');

class MailSender {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_ADDRESS,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  sendEmail(targetEmail, content) {
    const message = {
      from: 'HearMusic',
      to: targetEmail,
      subject: 'Permintaan Ekspor Lagu',
      text: 'Berikut kami lampirkan lagu yang terdapat didalam playlist anda.',
      attachments: [
        {
          filename: 'songs.json',
          content,
        },
      ],
    };

    return this._transporter.sendMail(message);
  }
}

module.exports = MailSender;
