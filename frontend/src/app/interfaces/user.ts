import { Billing } from "./billing";
import { PaypalUser } from "./paypal-user";
import { Profile } from "./profile";
import { StripeUser } from "./stripe-user";
import { TrainingCategory } from "./training-category";
import { TrainingSelectTaxonomy } from "./training-select-taxonomy";
import { TrainingTaxonomy } from "./training-taxonomy";

export interface User {

    _id: string;
    username: string;
    email: string;
    password: string;
    salt: string;
    profile: Profile;
    billing?: Billing;
    custom_categories?: TrainingCategory[];
    custom_taxonomies?: TrainingTaxonomy[];
    custom_select_taxonomies?: TrainingSelectTaxonomy[];
    emailVerified: string;
    role: string;
    canPublish?: boolean;
    cookie?: string;
    passKey?: string;
    lang?: string;

    stripe?: StripeUser;
    paypal?: PaypalUser;
  }

  export interface UserInput {
    username: string;
    email: string;
    password: string;
    profile: Profile;
  }

  export interface UserInfo extends UserInput {
    salt: string,
    password: string
    emailVerified: string
  }


  
