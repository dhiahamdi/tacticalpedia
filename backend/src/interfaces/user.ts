
import { Document } from 'mongoose';
import { Profile } from '../interfaces/profile'
import { TrainingCategory } from './training/training-category';
import { TrainingTaxonomy } from './training/training-taxonomy';
import { PaypalUser } from './payments/paypal-user';
import { StripeUser } from './payments/stripe-user';
import { TrainingSelectTaxonomy } from './training/training-select-taxonomy';
import { Billing } from './billing';

export interface User {

    int_id?: number;
    _id: string;
    username: string;
    email: string;
    password: string;
    salt: string;
    profile: Profile;
    billing: Billing;
    custom_categories?: TrainingCategory[];
    custom_taxonomies?: TrainingTaxonomy[];
    custom_select_taxonomies?: TrainingSelectTaxonomy[];
    emailVerified: string;
    role: string;
    cookie?: string;
    passKey?: string;
    lang?: string;

    stripe?: StripeUser;
    paypal?: PaypalUser;
    
    canPublish?: boolean;
  }

  export interface UserInput {
    username: string;
    email: string;
    password: string;
    profile: Profile;
    lang?: string;
  }

  export interface UserInfo extends UserInput {
    salt: string;
    password: string;
    emailVerified: string;
  }


  
