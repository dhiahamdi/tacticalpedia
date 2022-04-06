export interface Profile {
    name: string;
    surname: string;
    user: string;
    address?: string;
    discipline?: string;
    role?: string;
    qualification?: string;
    image?: any;
    paypal_subscription_status?: string,
    stripe_subscription_status?: string
}