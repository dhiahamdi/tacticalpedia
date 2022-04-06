import express from 'express'
import { PaypalUser } from '../../../interfaces/payments/paypal-user';
import PaypalService from '../../../services/paypal';

const router = express.Router();

router.post('/save-subscription', async(req, res)=> {

    const paypalService = new PaypalService();

    try{
        const paypalUser:PaypalUser = {
            paypalId: req.body.payerId,
            paypal_subscription_id: req.body.paypal_subscription_id,
            paypal_subscription_status: 'active',
            paypal_subscription_interval: req.body.subscription_type
        };

        await paypalService.savePaypalSubscription(req.loggedUser, paypalUser);

        res.status(200).json({response: 'paypal_subscription_saved'});

    }catch(e){

        res.status(400).send({message: e.message});
    }

});


router.post('/upgrade-plan', async(req, res)=> {

    const paypalService = new PaypalService();

    try{

        const upgrade = await paypalService.upgradePlan(req.loggedUser, req.body.new_plan, function(url, error) {
            if (error) {
                res.status(400).json({error: error});
                return;
            }

            res.status(200).json({response: url});
        });

        

    }catch(e){

        res.status(400).send({message: e.message});
    }

});


router.post('/cancel-subscription', async(req, res)=> {

    const paypalService = new PaypalService();

    console.log('cancel-subscription');

    try{

        const upgrade = await paypalService.cancelPaypalSubscription(req.loggedUser, function(result, error) {
            
            if (error) {
                console.log(error);
                res.status(400).json({error: error});
                return;
            }

            res.status(200).json({response: result});
        });

        

    }catch(e){

        res.status(400).send({message: e.message});
    }

});


export default router;