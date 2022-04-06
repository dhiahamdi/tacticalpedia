import mongoose from 'mongoose';
import { User } from '../interfaces/user';
import customizationSchema from './customization';
import selectCustomizationSchema from './select-customization';

var AutoIncrement = require('mongoose-sequence')(mongoose);


const User = new mongoose.Schema(
    {

      int_id: {
        type: Number,
      },

      username: {
        type: String,
        required: true,
        index: true,
      },
  
      email: {
        type: String,
        lowercase: true,
        unique: true,
        index: true,
        required: true,
      },
  
      password: {
        type: String
      },
  
      salt: {
        type: String
      },

      emailVerified: {
        type: String
      },

      cookie: {
        type: String
      },
      
      passKey: { 
        type: String
      },
      
      lang: { 
        type: String
      },

      profile: {

        name:{
            type: String,
            required: true    
        },
        surname:{
            type: String,
            required: true    
        },
        address:{
            type: String,    
        },
        role:{
            type: String,   
        },
        discipline:{
            type: String,  
        },
        qualification:{
            type: String, 
        },
        image:{
            type: String, 
        },
      },


      billing: {
        type: {
          
          userType: {
            type: String,
            required: true
          },
  
          name: {
            type: String
          },
  
          surname: {
            type: String
          },
  
          companyName: {
            type: String
          },
  
          pIva: {
            type: String
          },
  
          codiceFiscale: {
            type: String
          },
  
          address: {
            type: String,
            required: true
          },
  
          city: {
            type: String,
            required: true
          },
  
          zip: {
            type: String,
            required: true
          },
  
          
          state: {
            type: String,
            required: true
          },
  
          country: {
            type: String,
            required: true
          }
        },

        required: false

      },

      custom_categories: [customizationSchema],
      custom_taxonomies: [customizationSchema],
      custom_select_taxonomies: [selectCustomizationSchema],

      paypal: {

        paypalId: {
          type: String
        },

        paypal_subscription_id: {
          type: String
        },

        paypal_subscription_status: {
          type: String
        },

        paypal_subscription_interval: {
          type: String
        }

      },


      stripe: {

        stripe_customer_id:{
          type: String
        },

        stripe_subscription_id:{
          type: String
        },

        stripe_subscription_status: {
          type: String
        },

        stripe_subscription_interval: {
          type: String
        }

      },
  
      role: {
        type: String,
        default: 'user',
      },

      canPublish: {
        type: Boolean,
        default: false
      }
    },
    { timestamps: true },
  );


User.plugin(AutoIncrement, {id:'user',inc_field: 'int_id'});

const UserModel = mongoose.model<User & mongoose.Document>('User', User);
  

export default UserModel;