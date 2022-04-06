import express from 'express'
import ProfileService from '../../../services/profile';

const router = express.Router();


router.post('/billing/update', async (req, res)=>{

    const profileService = new ProfileService();

    try{
        profileService.updateBillingInfo(req.loggedUser, req.body);
        return res.status(200).send();
    
    }catch(e){

        return res.status(400).send({message: e.message});
    }
});


export default router