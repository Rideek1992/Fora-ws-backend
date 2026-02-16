import { Router } from 'express';
import MailRouter from './mail.router';
import axios from "axios";
import {MailSend} from "../services/mail.service";
import {get} from "node:http";
import path from "path";
import fs from "fs";
import handlebars from "handlebars";

console.log('Index router load')

const router = Router();

router.get('/health', (req, res) => {
    res.json({ message: 'Hello World!' });
})


const mackOrder = {
    informationCode: "OR.20260215.A7WWT",
    ContactInfo: {
        firstName: "Damian",
        lastName: "Rabiński",
        emailAddress: "damian@test.pl",
        preferredContact: "email",
        phoneNumber: "123456789",
        position: "Kierownik"
    },
    CompanyInfo: {
        nameCompany: "FORA Poligrafia",
        country: "Polska",
        region: "Mazowsze",
        city: "Warszawa",
        postCode: "00-000",
        companySize: "10-50",
        industry: "Magazyn",
    },
    RequestInfo: {
        message: "To jest przykładowa wiadomość testowa.",
        conversationElement: "odzież robocza"
    }
}

function renderTemplate(templatePath: string, data: any) {
    const basePath = path.join(__dirname, '../templates/emails');
    const layoutSource = fs.readFileSync(path.join(basePath, 'layout.html'), 'utf8');
    const tamplateSource = fs.readFileSync(path.join(basePath, `${templatePath}.html`), 'utf8');

    const compiledTemplate = handlebars.compile(tamplateSource);
    const content = compiledTemplate(data);

    const compiledLayout = handlebars.compile(layoutSource);

    return compiledLayout({content});
}

    router.get('/test', (req, res) => {
        try{
            const html = renderTemplate('client', mackOrder)
            res.send(html)
        }catch (err) {
            console.log(err)
        }
})

router.post('/info', async (req, res) => {
    try {
        const {orderId} = req.body;

        if(!orderId) return res.status(400).json({error: 'Brak orderId'})

        const response = await axios.get(process.env.URL_STRAPI + `/api/fora-ws-contacts/${orderId}?populate=*`)

        const order = response.data.data;

        if(!order) return res.status(404).json({error: 'Order not found'})


        //wysyłamy maila do Admina Fora WS
        await MailSend.sendAdminMail(order)
        await MailSend.sendContactMail(order)

        res.status(200).json({success: true})
    }catch (err) {
        console.log(err)
    }
})

router.use('/mail', MailRouter);


export default router;