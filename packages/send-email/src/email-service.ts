import nodemailer from 'nodemailer';
import { promisify } from 'util';
import _ from 'lodash';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { MailOptions } from 'nodemailer/lib/stream-transport';
import template from 'art-template';

function isString(x: any): x is string {
  return typeof x === 'string';
}

export default async (
  {
    config,
    mail,
  }: any,
  inputs: any,
) => {
  const transporter = nodemailer.createTransport(config);
  if (isString(mail.text) && !_.isEmpty(mail.text)) {
    mail.text = template.render(mail.text, inputs);
  } else if (isString(mail.html) && !_.isEmpty(mail.text)) {
    mail.html = template.render(mail.html, inputs);
  }
  await wrapedSendMail(transporter, mail);
};

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function wrapedSendMail(transporter: any, mailOptions: any){
  return new Promise((resolve,reject)=>{
      transporter.sendMail(mailOptions, function(error: any, info: any){
        if (error) {
          console.log(error);
          resolve(false);
        } 
      else {
          resolve(true);
        }
      });
  })
}