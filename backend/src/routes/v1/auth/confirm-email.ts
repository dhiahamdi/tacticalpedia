import express from 'express';
import { ConfirmEmail } from '../../../interfaces/confirm-email';

import AuthService from '../../../services/auth';

const router = express.Router();

router.get('/', async (req, res) => {

        const authService = new AuthService();

        const confirmEmail = getConfirmEmailFromRequest(req);

        try{
            const userRecord = await authService.confirmEmail(confirmEmail);
            return res.status(200).json(userRecord);

        }catch(e){
            return res.status(400).send({message: e.message});
        }

    }
);



router.post('/send-confirm', async (req, res) => {

    const authService = new AuthService();


    try{
        await authService.sendConfirmEmail(req.body.email);
        
        return res.status(200).json({response: 'EMAIL_SENT'});

    }catch(e){
        return res.status(400).send({message: e.message});
    }

}
);


function getConfirmEmailFromRequest(req){

    const confirmEmail: ConfirmEmail = {
        email: req.query['email'],
        key: req.query['key']
    }

    return confirmEmail;

}

export default router;