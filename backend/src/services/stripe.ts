import UserDao from "../dao/UserDao";
import { StripeCustomerInfo } from "../interfaces/payments/stripe-customer-info";
import { StripeProration } from "../interfaces/payments/stripe-proration";
import { StripeUser } from "../interfaces/payments/stripe-user";
import { StripeWebHook } from "../interfaces/payments/stripe-webhook";
import { User } from "../interfaces/user";
import MailerService from "./mailer";

const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET);
const path = require('path');
const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: path.dirname(require.main.filename) + '/combined.log',  prettyPrint: true })
    ]
  });

export default class StripeService{
    constructor(){}

    /**
     * Get stripe billing portal of customer
     * 
     * @param user  
     * @returns stripe billing portal
     */
    public async createBillingPortal(user: User): Promise<any>{

        try{

            if(!user.stripe || !user.stripe.stripe_customer_id) throw new Error('User is not a stripe customer');

            const customer = await stripe.customers.retrieve(user.stripe.stripe_customer_id);

            if(!customer) throw new Error('Cannot finde stripe customer');

            const billingPortal = await stripe.billingPortal.sessions.create({
                customer: customer.id,
                return_url: process.env.FRONT_END_URL,
              });

            if(!billingPortal) throw new Error('Cannot create billing portal');

            return billingPortal;
        
        }catch(e){

            throw(e);
        }
    }

    /**
     * Subscribe paying with stripe
     * 
     * @param user  
     * @param paymentMethodId
     * @param stripeCustomeInfo
     * @returns stripe subscription
     */
    public async payWithStripe(user: User, paymentMethodId: any, stripeCustomeInfo: StripeCustomerInfo, subscription_type?: string){

        try{

            //create or get customer
            let customer;
            let userRecord;
            let stripeUser: StripeUser;

            //create user
            if(!user.stripe || !user.stripe.stripe_customer_id){

                customer = await stripe.customers.create({
                    email: user.email,
                    name: user.profile.name,
                });

                if(!customer) throw new Error('Cannot create custormer');

                //save customer id on DB
                stripeUser = {
                    stripe_customer_id: customer.id,
                }

                userRecord = await UserDao.updateUser(user, {stripe: stripeUser});

                if(!userRecord) throw new Error('Unable to save customer');
            }

            //retrieve customer
            else{
                customer = await stripe.customers.retrieve(user.stripe.stripe_customer_id);

                if(!customer) throw new Error('Unable to retrieve stripe customer');
            }

            //add payment method to customer

            const paymentMethod = await stripe.paymentMethods.attach(
                paymentMethodId,
                {customer: customer.id});

            if(!paymentMethod) throw new Error('Cannot add payment method');

            customer = await stripe.customers.update(customer.id,{
                invoice_settings: {
                  default_payment_method: paymentMethodId,
                }
              });

            if(!customer) throw new Error('Unable to attach payment method to customer');

            console.log(stripeCustomeInfo.planId);
            //create subscription
            const subscription = await stripe.subscriptions.create({
                customer: customer.id,
                items: [{
                    plan: stripeCustomeInfo.planId,
                }],
                expand: ["latest_invoice.payment_intent"],
                });
            
            if(!subscription) throw new Error('Unable to create subcription');

            //save subscription on DB

            stripeUser = {
                stripe_customer_id: customer.id,
                stripe_subscription_id: subscription.id,
                stripe_subscription_status: 'active',
                stripe_subscription_interval: subscription_type
            }

            userRecord = await UserDao.updateUser(user, {stripe: stripeUser});

            if(!userRecord) throw new Error('Unable to save subscription');

            //Send mail to admin
            const mailerService = new MailerService();
            mailerService.sendAdminNewSubscription(userRecord.username, 'Stripe');

            return subscription;

        }catch(e){

            throw(e);
        }
    }

    /**
     * Handle stripe webhook
     * 
     * @param stripeWebHook: StripeWebHook
     */
    public async handleStripeWebHook(stripeWebHook: StripeWebHook){

        const mailerService = new MailerService();
        
        logger.info('stripe webhook arrived');
        logger.info(stripeWebHook);

        try{ 

            if (stripeWebHook.type == 'customer.subscription.updated' || stripeWebHook.type == 'customer.subscription.deleted'){

                let customer_object = await stripe.customers.retrieve(
                    stripeWebHook.customer_id,
                    { expand: ["default_source"] }
                );

                if(!customer_object) throw new Error('Cannot retrieve stipe customer');

                let userRecord = await UserDao.getUserByStripeId(stripeWebHook.customer_id);

                const user = userRecord.toObject();

                logger.info('user');
                logger.info(user);

                if(!userRecord) throw new Error('USER_NOT_FOUND');

                if (stripeWebHook.object && stripeWebHook.object.status){

                    if (stripeWebHook.object.status === 'active') {
                        
                        logger.info('user stripe status to active');

                        userRecord = await UserDao.updateUser(user, {'stripe.stripe_subscription_status': 'active'});
                        if(!userRecord) throw new Error('Unable to update user on Db');
                    }

                    if (stripeWebHook.object.status === 'past_due' || stripeWebHook.object.status === 'unpaid'){

                         logger.info('past_due o or unpaid');

                         // Send notification email
                         mailerService.sendPastDueEmail(user.email, user.username, user.lang);

                         userRecord = await UserDao.updateUser(user, {'stripe.stripe_subscription_status': 'past_due'});
                         if(!userRecord) throw new Error('Unable to update user on Db');
                    }

                    if (stripeWebHook.object.status === 'canceled'){

                        logger.info('canceled');

                        userRecord = await UserDao.updateUser(user, {'stripe.stripe_subscription_status': 'canceled'});
                        if(!userRecord) throw new Error('Unable to update user on Db');
                    }

                    if (stripeWebHook.object.status === 'incomplete_expired'){

                        logger.info('incomplete_expired');

                        userRecord = await UserDao.updateUser(user, {'stripe.stripe_subscription_status': 'incomplete_expired'});
                        if(!userRecord) throw new Error('Unable to update user on Db');
                    }

                    if (stripeWebHook.object.status === 'trialing'){

                        logger.info('trialing');

                        userRecord = await UserDao.updateUser(user, {'stripe.stripe_subscription_status': 'trialing'});
                        if(!userRecord) throw new Error('Unable to update user on Db');
                    }

                }
            }

            return true;

        }catch(e){
            throw(e);
        } 



        
    }


    /**
     * Gets proration overview
     * 
     * @param user  
     * @returns stripe billing portal
     */
     public async getProration(proration: StripeProration) {

        // Set proration date to this moment:
        const proration_date = Math.floor(Date.now() / 1000);

        const subscription = await stripe.subscriptions.retrieve(proration.subscription_id);

        // See what the next invoice would look like with a price switch
        // and proration set:
        const items = [{
        id: subscription.items.data[0].id,
        price: proration.new_price == 'yearly' ? process.env.STRIPE_YEARLY_PLAN : process.env.STRIPE_MONTHLY_PLAN // Switch to new price
        }];

        const invoice = await stripe.invoices.retrieveUpcoming({
        customer: proration.customer_id,
        subscription: proration.subscription_id,
        subscription_items: items,
        subscription_proration_date: proration_date,
        });

        return invoice;
    }


    /**
     * Updates a stripe plan (used for proration)
     * 
     * @param subscriptionId  
     * @param newPrice
     * @returns new subscription
     */
     public async updatePlan(user: User, newPrice: String) {

        const proration_date = Math.floor(Date.now() / 1000);

        // Retrieve current subscription
        const subscription = await stripe.subscriptions.retrieve(user.stripe.stripe_subscription_id);

        // Update current subscription
        const new_subscription = await stripe.subscriptions.update(
            user.stripe.stripe_subscription_id,
        {
            items: [{
            id: subscription.items.data[0].id,
            price: newPrice == 'yearly' ? process.env.STRIPE_YEARLY_PLAN : process.env.STRIPE_MONTHLY_PLAN // Switch to new price
            }],
            proration_date: proration_date,
        }
        );

        // Update user
        const userRecord = await UserDao.updateUser(user, {
            'stripe.stripe_subscription_interval': newPrice,
            'stripe.stripe_subscription_id': new_subscription.plan.id,
            'stripe.stripe_subscription_status': new_subscription.status
        });

        return new_subscription;
    }


}