const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Test Account <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //SEndgrid
      return nodemailer.createTransport({
        service: 'SendinBlue',

        auth: {
          user: process.env.SEND_IN_BLUE_USER,
          pass: process.env.SEND_IN_BLUE_PASS,
        },
      });
      return 1;
    }

    return nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      auth: {
        user: 'test10252023@gmail.com',
        pass: 'becvsvlhdfzfeonx',
      },
      //Activate in gmail "less secure app" option
    });
  }
  async send(template, subject) {
    //Send the actual email
    //1)Render HTML based on a pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    //2)Define the email options

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // text: htmlToText(html),
      //html:
    };

    //3) Create a transport and send email\
    const transport = this.newTransport();
    await transport.sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your password reset token (valid for 10 mins)'
    );
  }
};
