import { User, UserInfo } from '../interfaces/user';
import UserModel from '../models/user';
import mongoose from 'mongoose';

export default class UserDao {

    constructor(){
    }


     /***
     * Retrieves user from a given cookie
     * 
     * @param cookie    login property of cookie making the request
     */
    public static async getUserById(_id: string) {
        return await UserModel.findOne({_id: mongoose.Types.ObjectId(_id)});
    }

    /**
     * 
     * @param username 
     * @returns user
     */
    public static async getUserFromUsername(username: string){
        return await UserModel.findOne({username: username});
    }


    /***
     * Retrieves user from a given cookie
     * 
     * @param cookie    login property of cookie making the request
     */
    public static async getUserByCookie(cookie: string) {
        return await UserModel.findOne({cookie: cookie});
    }


    /***
     * Retrieves user with a given email
     * 
     * @param email    
     */
     public static async getUserByEmail(email: string) {
        return await UserModel.findOne({email: email});
    }

    /***
     * Retrieves user with a given email
     * 
     * @param email    
     */
     public static async searchUserByEmail(email: string) {
        return await UserModel.findOne({email: email}).select('_id , email , username');
    }


    /***
     * Retrieves user by its passkey
     * 
     * @param passkey
     */
     public static async getUserByPassKey(passkey: string) {
        return await UserModel.findOne({passKey: passkey});
    }


    /**
     * Retrieves all the users
     * 
     */
     public static async getUsers() {

        return await UserModel.find({});
    }


    /***
     * Updates a user with the given fields
     * 
     * @param user    user to update
     * @param field   key value pairs to update
     */
    public static async updateUser(user: User, fields: any) {

        if ('profile' in fields && !('image' in fields.profile)) 
            fields.profile.image = (await UserDao.getUserById(user._id)).profile.image; 

        return await UserModel.findByIdAndUpdate(user._id, 
            fields, {returnOriginal: false});
    }

    /***
     * Insert a new user into users collection
     * 
     * @param user    info of the user to insert
     */
    public static async createUser(user: UserInfo) {
        return await UserModel.create(user);
    }

    /**
     * Find user by paypalId
     * 
     * @param paypalId
     */
    public static async getUserByPaypalId(paypalId: string){

        return await UserModel.findOne({'paypal.paypalId': paypalId});
    }
    
    /**
     * Find user by stripe customer Id
     * 
     * @param stripe_customer_id
     */
     public static async getUserByStripeId(stripe_customer_id: string){

        return await UserModel.findOne({'stripe.stripe_customer_id': stripe_customer_id});
    }


    public static async getProfilePicFromId(user_id: string){

        const userRecord = await UserModel.findById(user_id);

        return userRecord.profile.image;
    }


    /**
     * Deletes user by its id
     * 
     * @param user_id
     */
    public static async deleteUserById(user_id: string) {
        return await UserModel.deleteOne({_id: mongoose.Types.ObjectId(user_id)});
    }
}