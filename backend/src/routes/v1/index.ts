import express from 'express';

import isAuth from './middlewares/isAuth';
import isAdmin from './middlewares/isAdmin';
import isTacticalpadAuth from './middlewares/isTacticalpadAuth';

import login from './auth/login';
import logout from './auth/logout';
import signup from './auth/signup';
import confirmEmail from './auth/confirm-email';
import lostPassword from './auth/lost-password';
import getUser from './auth/get-user';

import profile from './profile/profile';
import publicProfile from './profile/public';
import billing from './profile/billing';

import paypal from './payments/paypal'
import stripe from './payments/stripe';
import subscription from './payments/subscription';
import webhooks from './payments/webhooks';

import training from './training/training';
import customize from './training/customize';
import customizePublic from './training/customizePublic';
import publicTraining from './training/publicTraining';

import tacticalpad from './tacticalpad/tacticalpad';
import url from './tacticalpad/url';
import tacticalpadAuth from './tacticalpad/auth/auth';

import manageUsers from './admin/manage-users';
import adminCustomization from './admin/customization';
import group from './group/group';


const router = express.Router();


/* TACTICALPAD */
router.use('/tacticalpad/v1', tacticalpadAuth);
router.use('/tacticalpad/v1', url);
router.use('/tacticalpad/v1', tacticalpad);


/*
No authentication needed for theese routes
*/

router.use('/login', login);
router.use('/signup', signup);
router.use('/confirm-email', confirmEmail)
router.use('/lost-password', lostPassword);

//stripe and paypal webhooks
router.use('/webhooks', webhooks);

//public trainings
router.use('/training', publicTraining);

//public profile
router.use('/profile', publicProfile);

router.use('/admin', adminCustomization); // Getters do not require admin auth

router.use('/training', customizePublic); // Get custom options for a given user (for public trainings)


/**
* Authentication is needed for theese routes
*/
router.use(isAuth);

router.use('/logout', logout);
router.use('/user', getUser);
router.use('/profile', profile);
router.use('/profile', billing);

//training
router.use('/training', customize);
router.use('/training', training);

//payments
router.use('/paypal', paypal);
router.use('/stripe', stripe);
router.use('/subscription', subscription);
//groups
router.use('/group', group);
/**
* Admin role is needed for theese routes
*/

router.use(isAdmin);
router.use('/admin', manageUsers);



export default router;