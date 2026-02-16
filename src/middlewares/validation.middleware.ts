import {Request, Response, NextFunction} from 'express';


export const validateContactBody = (req: Request, res: Response, next: NextFunction) => {
    const {name, email, message} = req.body;

    if(!name || typeof name !== 'string'){
        return res.status(400).json({error: 'Name is required'})
    }

    if(!email || typeof email !== 'string'){
        return res.status(400).json({error: 'Email is required'})
    }

    if(!message || typeof message !== 'string'){
        return res.status(400).json({error: 'Message is required'})
    }else{
        next();
    }
}