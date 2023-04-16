import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

//이것도 env가 아니라 별도의 옵션을 받아서 쓰는게 좋을까?
const { email_service, user, pass } = process.env;

class Mail {
  to = null;
  subject = null;
  text = null;
  html = null;
  mailOptions = {};
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: email_service,
      auth: {
        user: user,
        pass: pass
      }
    });
  }
  setTo(v) {
    this.to = v;
  }
  setSubject(v) {
    this.subject = v;
  }
  setText(v) {
    this.text = v;
  }
  setHtml(v) {
    this.html = v;
  }
  setMailOptions() {
    this.mailOptions.to = this.to;
    if (this.subject) this.mailOptions.subject = this.subject;
    this.mailOptions.text = this.text;
    if(this.html) this.mailOptions.html = this.html;
  }
  sendMail() {
    this.setMailOptions();
    return this.transporter.sendMail(this.mailOptions);
  }
}
/**
 * 
 * @param { string } to: required > 받는 사람
 * @param { string } subject: option > 제목
 * @param { string } text: required > 텍스트 본문
 * @param { string } html: options > HTML 본문
 * @returns 전송 결과 response 내용
 */
export const mailSand = async ({to, subject, text, html}) => {
    try {
      //메일 클래스 인스턴스 생성
      const mail = new Mail();
      
      //받는 사람 속성 없으면 에러 발생, 있으면 세팅
      if (!to) throw new Error('Need "to" Propertie.');
      mail.setTo(to);

      //제목 있으면 세팅
      if (subject) mail.setSubject(subject);

      /**
       * text나 html은 둘 중 하나가 꼭 있어야함
       * 둘다 있을 경우 text는 안들어가고 html이 이메일 내용으로 들어가짐
       */
      if (!text && !html) throw new Error('Need "text" or "html" Propertie.')
      if (text) mail.setText(text);
      if (html) mail.setHtml(html);

      //메일 보내기 실행
      const result = await mail.sendMail();

      return result.response;
    } catch (err) {
      throw new Error(err);
    }
}