import nodemailer from 'nodemailer'
import fs from 'fs'
import path from 'path'
import handlebars from 'handlebars'

interface OrderData {
  informationCode: string;
  ContactInfo: {
      firstName: string;
      lastName: string;
      emailAddress: string;
      phoneNumber?: string;
  };
  CompanyInfo: {
      nameCompany: string;
      industry?: string;
  };
  RequestInfo:{
      message: string;
      conversationElement: string;

  };

}

function renderTemplate(templatePath: string, data: any) {
    const basePath = path.join(__dirname, '../templates/emails');
    const layoutSource = fs.readFileSync(path.join(basePath, 'layout.html'), 'utf8');
    const tamplateSource = fs.readFileSync(path.join(basePath, `${templatePath}.html`), 'utf8');

    const compiledTemplate = handlebars.compile(tamplateSource);
    const content = compiledTemplate(data);

    const compiledLayout = handlebars.compile(layoutSource);

    return compiledLayout({ content });
}


class MailService {
    private transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST as string,
        port: Number(process.env.SMTP_PORT),
        secure: true,
        auth: {
            user: process.env.SMPT_USER,
            pass: process.env.SMPT_PASS
        }
    });



    async sendAdminMail(order: OrderData) {

        const html = renderTemplate('admin', order)


        await this.transporter.sendMail({
            from: order.ContactInfo.lastName ? `${order.ContactInfo.firstName} ${order.ContactInfo.lastName } <${order.ContactInfo.emailAddress}>` :`${order.ContactInfo.firstName}  <${order.ContactInfo.emailAddress}>` ,
            to: process.env.MAIL_TO,
            subject: `Nowe zapytanie | ${order.RequestInfo.conversationElement} | zgodnie z numerem:  ${order.informationCode}`,
            html: html
        })
    }

    async sendContactMail(order: OrderData) {
        const htmlClient = renderTemplate('client', order)
        await this.transporter.sendMail({
            from: `"Fora Warehause System " <${process.env.SMPT_USER}>`,
            to: order.ContactInfo.emailAddress,
            subject: `Zapytanie nr ${order.informationCode}`,
            html: htmlClient
        })
    }
}

export const MailSend = new MailService()