import express from 'express'
import { StripeWebHook } from '../../../interfaces/payments/stripe-webhook';
import PaypalService from '../../../services/paypal';
import StripeService from '../../../services/stripe';


const router = express.Router()


router.post('/paypal', async (req, res)=> {

    const paypalService = new PaypalService();

    try{

        if(req.body.txn_type && req.body.payer_id){

            await paypalService.handlePaypalWebHooks(req.body.payer_id, req.body.txn_type);

            res.status(200).json({response: 'webhook handled'});

        }else{

            res.status(200).send({response: 'unhandled webhooks'});
        }
    }catch(e){

        res.status(400).send({message: e.message});
    }

});

router.post('/stripe', async (req, res)=> {

    const Stripe = require('stripe');
    const stripe = Stripe(process.env.STRIPE_SECRET);

    const stripeService = new StripeService()

    try{
        const sig = req.headers['stripe-signature'];
        //var event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_SECRET);
        const stripewebHook = getStripeWebHookFromRequest(req.body);

        await stripeService.handleStripeWebHook(stripewebHook);

    }catch(e){
        console.error(e.message);

    } finally {
        res.sendStatus(200);
    }
});

function getStripeWebHookFromRequest(req): StripeWebHook{

    let data = req.body.data;

    const stripeWebHook: StripeWebHook = {

        object: data.object,
        customer_id: data.object.customer,
        previous_attributes: data.previous_attributes,
        product_id: data.object.plan.product,
        plan_name: data.object.plan.nickname,
        type: req.body.type
    }

    return stripeWebHook
}


export default router