import express from 'express'
import { StripeCustomerInfo } from '../../../interfaces/payments/stripe-customer-info';
import { StripeProration } from '../../../interfaces/payments/stripe-proration';
import StripeService from '../../../services/stripe';

const router = express.Router();

router.post('/create-customer-portal-session', async (req, res)=> {

    const stripeService = new StripeService();

    try{

        const billingPortal = await stripeService.createBillingPortal(req.loggedUser);

        res.status(200).json({url: billingPortal.url});

    }catch(e){

        res.status(400).send({message: e.message});
    }

});

router.post('/handlePayment', async (req, res)=> {

    const stripeService = new StripeService();

    try{

        const subscription_type: string = req.body.subscription_type;
        let planId: string;

        if(subscription_type === 'monthly') planId = process.env.STRIPE_MONTHLY_PLAN;
        else if(subscription_type === 'yearly') planId = process.env.STRIPE_YEARLY_PLAN;

        const stripeCustomeInfo: StripeCustomerInfo = {
            name: req.body.name,
            email: req.body.email,
            planId: planId,
          };
        
        const subscription = await stripeService.payWithStripe(req.loggedUser, req.body.paymentMethodId, stripeCustomeInfo, subscription_type);

        return res.status(200).json(subscription);

    }catch(e){

        console.log(e);

        if(e.type) return res.status(400).send({message: e.type});

        return res.status(400).send({message: e.message});
    }

});


router.post('/get-proration', async (req, res)=> {

    const stripeService = new StripeService();

    try{

        if (req.body.customer_id != req.loggedUser.stripe.stripe_customer_id) 
            res.status(401).send({message: 'NOT AUTHORIZED'});
        
        const proration = await stripeService.getProration(req.body as StripeProration);
        return res.status(200).json(proration);

    }catch(e){

        if(e.type) return res.status(400).send({message: e.type});

        return res.status(400).send({message: e.message});
    }

});



router.post('/update-plan', async (req, res)=> {

    const stripeService = new StripeService();

    try{

        if (!req.loggedUser.stripe || !req.loggedUser.stripe.stripe_subscription_id) return res.status(400).send({message: 'ERROR'});

        const new_subscription = await stripeService.updatePlan(req.loggedUser, req.body.new_price);
        
        if (!new_subscription) return res.status(400).send({message: 'ERROR'});

        return res.status(200);

    }catch(e){

        if(e.type) return res.status(400).send({message: e.type});

        return res.status(400).send({message: e.message});
    }

});


export default router;