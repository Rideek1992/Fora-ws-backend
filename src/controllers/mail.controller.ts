import {Request, Response} from 'express';
import {MailSend} from '../services/mail.service';

export const sendMail = async (req: Request, res: Response) => {
    const { name, email, message } = req.body
    //
    // try{
    //     const result = await MailSend.sendContactMail({name, email, message})
    //     res.status(200).json(result)
    // }catch(e){
    //     console.error(e)
    //     res.status(500).json({error: 'Internal server error'})
    // }



}