import express from 'express'
import AuthService from '../../../services/auth';

const router = express.Router();

router.post('/', async (req, res)=> {
    
    const authService = new AuthService();

    try{

        await authService.sendResetPasswordEmail(req.body.email);

        res.status(200).json({response: 'EMAIL_SENT'});


    }catch(e){

        res.status(400).send({message: e.message});
    }

});


router.get('/reset-password', async (req, res)=> {

    const authService = new AuthService();

    try{

        await authService.validatePassKey(String(req.query['key']));

        res.status(200).json({response: 'valid_pass_key'});

    }catch(e){

        res.status(400).send({message: e.message});
    }


});

router.post('/reset-password', async (req, res)=> {

    const authService = new AuthService();

    try{

        await authService.resetPassword(req.body.key, req.body.pass);

        res.status(200).json({response: 'password_updated'})

    }catch(e){

        res.status(400).send({message: e.message});
    }

});

export default router