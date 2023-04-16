import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const { email_service, user, pass } = process.env;

// const transporter = nodemailer.createTransport({
//   service: email_service,
//   auth: {
//     user: user,
//     pass: pass
//   }
// });


const mailOptions = {
  from : user,
  to: '@',
  subject: 'Nodemailer Test',
  text: '노드 패키지 nodemailer를 이용해 보낸 이메일임'
};


// transporter.sendMail(mailOptions, (error, info) => {
//   if (error) {
//     console.error(error);
//   } else {
//     console.log('Email Sent : ', info);
//   }
// })

class Mail {
  constructor(to, subject, text, html) {
    this.mailOptions = {
      from : user,
      to: to,
      subject: subject,
      text: text,
      html: html || null
    }
    this.transporter = nodemailer.createTransport({
      service: email_service,
      auth: {
        user: user,
        pass: pass
      }
    });
  }

  
}

export const mailSand = () => {
  return new Promise( (resolve, reject) => {
    try {
      resolve('test');
    } catch (err) {
      reject(err);
    }
  })
}