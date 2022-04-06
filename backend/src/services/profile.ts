import { Profile } from '../interfaces/profile'
import UserModel  from '../models/user'
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { User } from '../interfaces/user';
import UserDao from '../dao/UserDao';
import { Billing } from '../interfaces/billing';
import HelperService from './helper';

export default class ProfileService{

    constructor(){}

    /**
     * Get profile along with username
     * 
     * @param user  
     * @returns user profile
     */
    public async getProfile(user: User): Promise<Profile>{
        try {
            const profile = user.profile;
            profile.user = user.username;
            return profile; 
        } catch(e) {
            throw(e);
        }
    }

    /**
     * 
     * @param username 
     * @returns user profile
     */

    public async getProfileFromUsername(username: string): Promise<Profile>{

        try{
            const userRecord = await UserDao.getUserFromUsername(username);

            if(!userRecord) throw new Error('Unable to find user');

            return userRecord.profile;

        }catch(e){

            throw(e);
        }
    }

    /**
     * 
     * @param username 
     * @returns user id
     */

    public async getUserIdFromUsername(username: string): Promise<String>{

        try{
            const userRecord = await UserDao.getUserFromUsername(username);
            if(!userRecord) throw new Error('Unable to find user');

            return userRecord._id;

        }catch(e){

            throw(e);
        }
    }

    /**
     * Retrieves the profile pic
     * 
     * @param user  
     * @returns url of profile pic
     */
    public async getProfilePic(user: User): Promise<String>{

        try {
            const profilePic = user.profile.image;
            
            if(!profilePic) return HelperService.getAssetPath('images/default-profile.jpg');

            return profilePic;

        }catch(e){
            throw(e);
        }
    }

    public async getProfilePicFromId(user_id: string): Promise<String>{

        try{
            const profilePic = await UserDao.getProfilePicFromId(user_id);

            if(!profilePic) return HelperService.getAssetPath('images/default-profile.jpg');

            return profilePic;

        }catch(e){

            throw(e);
        }
    }

    public async getFullNameFromId(user_id: string): Promise<String>{

        try{
            const userRecord = await UserDao.getUserById(user_id);

            if(!userRecord) throw new Error('Unable to find user');

            return userRecord.profile.name + ' ' +userRecord.profile.surname;

        }catch(e){
            throw(e);
        }
    }


    public async getUsernameFromId(user_id: string): Promise<String>{

        try{
            const userRecord = await UserDao.getUserById(user_id);

            if(!userRecord) throw new Error('Unable to find user');

            return userRecord.username;

        }catch(e){
            throw(e);
        }
    }


     /**
     * Updates user password
     * 
     * @param user  
     * @param oldPassword
     * @param password
     * @returns
     */
    public async updatePassword(user: User, oldPassword: string, password: string): Promise<any>{

        try{
            const validPassword = await argon2.verify(user.password, oldPassword);

            if(!validPassword) throw new Error('INVALID_PASSWORD'); //wrong password

            //hash new password
            const salt = randomBytes(32);
            const hashedPassword = await argon2.hash(password, { salt });

            let userRecord = await UserDao.updateUser(user, {password: hashedPassword});  

            if(!userRecord) throw new Error('Unable to update password');

            return;
         
        }catch(e){

            throw(e);
        }
    }


    /**
     * Updates profile infos
     * 
     * @param user  
     * @param oldPassword
     * @param password
     * @returns
     */
    public async updateProfile(user: User, newProfile: Profile): Promise<any>{

        try {

            const userRecord = await UserDao.updateUser(user, {profile: newProfile});
            
            if (!userRecord) throw new Error('Unable to update profile');

            return;

        } catch(e) {
            throw(e);
        }
    }


    /**
     * Updated billing info of a given user
     * 
     * @param user  
     * @returns user profile
     */
     public async updateBillingInfo(user: User, billing: Billing): Promise<Profile>{
        try {
            const userRecord = await UserDao.updateUser(user, {billing: billing});

            if (!userRecord) throw new Error('Unable to update profile');
            return;

        } catch(e) {
            throw(e);
        }
    }

    
    /**
     * @param user
     * 
     * @returns canpublish: boolean
     */
    public async canPublish(user: User): Promise<boolean>{

        try{
            const canPublish = user.canPublish;
            return canPublish;

        }catch(e){

            throw(e);
        }
    }


    /**
     * 
     * @param username 
     * @returns user id
     */

     public async setLang(user: User, lang: string): Promise<String>{

        try{
            const userRecord = await UserDao.updateUser(user, {lang: lang});
            if(!userRecord) throw new Error('Unable to find user');

            return userRecord._id;

        }catch(e){

            throw(e);
        }
    }
}