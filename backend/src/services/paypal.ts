import UserDao from "../dao/UserDao";
import { PaypalUser } from "../interfaces/payments/paypal-user";
import { User } from "../interfaces/user";
import MailerService from "./mailer";

const https = require('https')

const path = require('path');
const winston = require('winston');

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
      new winston.transports.File({ filename: path.dirname(require.main.filename) + '/combined.log',  prettyPrint: true })
    ]
  });


export default class PaypalService{

    constructor(){}

    /**
     * Subscribe paying with stripe
     * 
     * @param user  
     * @param paypalUser
     * @returns 
     */
    public async savePaypalSubscription(user: User, paypalUser: PaypalUser){

        try{

            const userRecord = await UserDao.updateUser(user, {paypal: paypalUser});

            if(!userRecord) throw new Error('Unable to save subscription');

            //Send mail to admin
            const mailerService = new MailerService();
            mailerService.sendAdminNewSubscription(userRecord.username, 'Paypal');

            return;

        }catch(e){
            throw(e);
        }
    }


    /**
     * Upgrades to a plan
     * 
     * @param user  
     * @param newPlan
     * @returns 
     */
     public async upgradePlan(user: User, newPlan: String, callback) {

        try {
            // SERVER SIDE UPGRADE PLAN HANDLING
            const secret = process.env.PAYPAL_SECRET_KEY;
            const client_id = process.env.PAYPAL_CLIENT_ID;
            const plan = newPlan == 'monthly' ? process.env.PAYPAL_MONTHLY_PLAN : process.env.PAYPAL_YEARLY_PLAN;
            const subscription_id = user.paypal.paypal_subscription_id;
            
            const data = JSON.stringify({
                plan_id: plan,
                application_context: {
                    brand_name: "TacticalPedia",
                    locale: "it-IT",
                    shipping_preference: "NO_SHIPPING",
                    payment_method: {
                        payer_selected: "PAYPAL",
                        payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED"
                    },
                    return_url: process.env.FRONT_END_URL + '/profile/manage-subscription?success=PAYMENT_SUCCES',
                    cancel_url: process.env.FRONT_END_URL + '/profile/manage-subscription' 
                }
            })

            const options = {
                hostname: process.env.PAYPAL_HOST,
                port: 443,
                path: '/v1/billing/subscriptions/' + subscription_id + '/revise',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + secret).toString('base64')
                } 
            }

            const req = https.request(options, res => {

                res.on('data', d => {

                    if (res.statusCode != 200) {
                        callback(null, JSON.parse(d.toString('utf8')).name);
                        return;
                    }
                    
                    const upgrade = JSON.parse(d.toString('utf8'));
                    callback(upgrade.links[0].href);
                })
              })
              
              req.on('error', error => {
                callback(null, error);
              })
              
              req.write(data);
              req.end()

            //TODO LISTEN WEBHOOK FOR PLAN CHANGE

            return;

        }catch(e){
            throw(e);
        }
    }



    /**
     * Upgrades to a plan
     * 
     * @param user  
     * @param newPlan
     * @returns 
     */
     public async cancelPaypalSubscription(user: User, callback) {

        try {
            // SERVER SIDE UPGRADE PLAN HANDLING
            const secret = process.env.PAYPAL_SECRET_KEY;
            const client_id = process.env.PAYPAL_CLIENT_ID;
            const subscription_id = user.paypal.paypal_subscription_id;
            
            const data = JSON.stringify({
                reason: 'User doesn\'t need a subscription anymore.'
            })

            const options = {
                hostname: process.env.PAYPAL_HOST,
                port: 443,
                path: '/v1/billing/subscriptions/' + subscription_id + '/cancel',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + secret).toString('base64')
                } 
            }

            const req = https.request(options, res => {

                res.on('data', d => {

                    if (res.statusCode != 204) {
                        callback(null, new Error('Can\'t cancel subscription.'));
                        return;
                    }
                    callback(true);
                })
              })
              
              req.on('error', error => {
                callback(null, error);
              })
              
              req.write(data);
              req.end()

            return;

        }catch(e){
            throw(e);
        }
    }


    /**
     * Upgrades to a plan
     * 
     * @param user  
     * @param newPlan
     * @returns 
     */
     public async getSubsriptionDetails(user: User, callback) {

        try {
            // SERVER SIDE UPGRADE PLAN HANDLING
            const secret = process.env.PAYPAL_SECRET_KEY;
            const client_id = process.env.PAYPAL_CLIENT_ID;
            const subscription_id = user.paypal.paypal_subscription_id;
            
            const data = JSON.stringify({
                reason: 'User doesn\'t need a subscription anymore.'
            })

            const options = {
                hostname: process.env.PAYPAL_HOST,
                port: 443,
                path: '/v1/billing/subscriptions/' + subscription_id,
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + Buffer.from(client_id + ':' + secret).toString('base64')
                } 
            }

            const req = https.request(options, res => {

                res.on('data', async d => {
                    callback(Buffer.from(d).toString());
                })
              })
              
              req.on('error', error => {
                callback(null, error);
              })
              
              req.write(data);
              req.end()

            return;

        }catch(e){
            throw(e);
        }
    }



    private paypalSyncRequest(options: any) {

        return new Promise((resolve, reject) => {

            const req = https.request(options, res => {

            res.on('data', d => {
                console.log(d);
                resolve(d);
            })
            })

            req.on('error', error => {
                reject(error);
            })

        });
    }


    /**
     * Handle 
     * 
     * @param paypalId
     * @param eventType  
     * @returns 
     */
    public async handlePaypalWebHooks(paypalId: string, eventType: string): Promise<any>{

        const mailerService = new MailerService();

        logger.info('webhook from paypal arrived');
        logger.info(paypalId);
        logger.info(eventType);

        console.log('webhook from paypal arrived');
        console.log(paypalId);
        console.log(eventType);

        try {

            let userRecord = await UserDao.getUserByPaypalId(paypalId);

            if(!userRecord) throw new Error('USER_NOT_FOUND');

            const user = userRecord.toObject();
        
            logger.info('user');
            logger.info(user);

            console.log('user');
            console.log(user);

            switch(eventType){


                case "recurring_payment":
                    logger.info('to active');
                    console.log('to active');
                    userRecord = await UserDao.updateUser(user, {'paypal.paypal_subsctipyion_status': 'active'});
                    if(!userRecord) throw new Error('Cannot update user');
                    break;

                case "recurring_payment_expired":
                case "recurring_payment_suspended_due_to_max_failed_payment": 
                    logger.info('to expired');
                    console.log('to expired');
                    userRecord = await UserDao.updateUser(user, {'paypal.paypal_subsctipyion_status': 'incomplete_expired'});
                    if(!userRecord) throw new Error('Cannot update user');
                    break;

                case "recurring_payment_suspended":
                case "recurring_payment_profile_cancel":
                    logger.info('to canceled');
                    console.log('to canceled');
                    userRecord = await UserDao.updateUser(user, {'paypal.paypal_subsctipyion_status': 'canceled'});
                    if(!userRecord) throw new Error('Cannot update user');
                    break;

                case "recurring_payment_failed":
                    //TODO check payment cycle and send e-mail

                    mailerService.sendPastDueEmail(user.email, user.username, user.lang);

                    logger.info('payment failed -> past_due');
                    console.log('payment failed -> past_due');
                    userRecord = await UserDao.updateUser(user, {'paypal.paypal_subsctipyion_status': 'past_due'});
                    if(!userRecord) throw new Error('Cannot update user');
                    break;
                
                default:
                    break;
            
            }


        }catch(e){
            throw(e);
        }
    }
}