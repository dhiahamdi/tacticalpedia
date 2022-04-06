export interface StripeUser{  
    stripe_customer_id: string;
    stripe_subscription_id?: string;
    stripe_subscription_status?: string;
    stripe_subscription_interval?: string;
}