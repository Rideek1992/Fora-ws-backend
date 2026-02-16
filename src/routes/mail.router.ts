import { Router } from 'express';
import {sendMail} from '../controllers/mail.controller';
import {validateContactBody} from '../middlewares/validation.middleware'
import {mailRateLimiter} from "../middlewares/rateLimit.middleware";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

console.log('Mail router load')

const router = Router();


// router.post('/send', validateContactBody, mailRateLimiter, sendMail)



function renderTemplate(templatePath: string, data: any) {
    const basePath = path.join(__dirname, '../templates/emails');
    const layoutSource = fs.readFileSync(path.join(basePath, 'layout.html'), 'utf8');
    const tamplateSource = fs.readFileSync(path.join(basePath, `${templatePath}.html`), 'utf8');

    const compiledTemplate = handlebars.compile(tamplateSource);
    const content = compiledTemplate(data);

    const compiledLayout = handlebars.compile(layoutSource);

    return compiledLayout({ content });
}

router.get('/layout', async (req, res) => {
    const mackOrder = {
        informationCode: "OR.20260215.A7WWT",
        ContactInfo: {
            firstName: "Damian",
            lastName: "Rabiński",
            emailAddress: "damian@test.pl"
        },
        CompanyInfo: {
            nameCompany: "FORA Poligrafia"
        },
        RequestInfo: {
            message: "To jest przykładowa wiadomość testowa.",
            conversationElement: "odzież robocza"
        }
    }
    const html = renderTemplate('admin', mackOrder)
    res.send(html)
})


export default router;
