import { User, UserInfo, UserInput } from "../interfaces/user";
import { randomBytes } from 'crypto';
import argon2 from 'argon2';
import  UserModel  from '../models/user'
import MailerService from "./mailer";
import { ConfirmEmail } from "../interfaces/confirm-email";
import { LoginRequest } from "../interfaces/login-request";
import UserDao from "../dao/UserDao";
import RefreshTokenDao from "../dao/RefreshTokenDao";

//function user to generate random string for email verification
const guid = function(){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}

export default class AuthService {


    constructor(){
    }


    /**
     * Signup a new user
     * 
     * @param userInput     infos provided by the user     
     * @returns
     */
    public async signup(userInput: UserInput): Promise<any>{

        try{
            const salt = randomBytes(32);
            const hashedPassword = await argon2.hash(userInput.password, { salt });

            const userInfo : UserInfo = {
                ...userInput,
                salt: salt.toString('hex'),
                password: hashedPassword,
                emailVerified: guid()
            };

            const userRecord = await UserDao.createUser(userInfo);

            if (!userRecord) {
                throw new Error('User cannot be created');
            }

            //send confirmation Email
            const mailerService = new MailerService();
            mailerService.sendConfirmationMail(userInfo.email, userInfo.username, userInfo.emailVerified, userInfo.lang);
            mailerService.sendAdminNewUser(userInfo.email, userInfo.username);
            
            return userInput;
        }

        catch (e) {
            console.error(e);
            throw e;
        }

    }


    /**
     * Confirm the email address for the user
     * 
     * @param confirmEmail    email and secret key to validate before unlocking  
     * @returns
     */
    public async confirmEmail(confirmEmail: ConfirmEmail): Promise <any>{

        const user = await UserDao.getUserByEmail(confirmEmail.email);

        if (user.emailVerified != confirmEmail.key)
            throw new Error('Email cannot be confirmed');
        
        const userRecord = await UserDao.updateUser(user, {emailVerified: 'verified'});

        if(!userRecord)
            throw new Error('Email cannot be confirmed');

        
        // Perform login
        //set cookie for login
        const cookie = guid();

        const userRecordLogin = await UserDao.updateUser(userRecord as User, {cookie: cookie});
        
        if(!userRecordLogin) throw new Error('Cannot set cookie'); //unexisting user

        const userResponse = userRecordLogin.toObject();
        
        Reflect.deleteProperty(userResponse, 'password');
        Reflect.deleteProperty(userResponse, 'salt');

        return userResponse;
    
    }


    /**
     * Sends a confirm email with secret key
     * 
     * @param email user email
     * @returns
     */
    public async sendConfirmEmail(email: string): Promise<void>{

        try {
            const userRecord = await UserDao.getUserByEmail(email);

            if(!userRecord) throw new Error('EMAIL_NOT_FOUND');

            const user = userRecord.toObject();

            const mailerService = new MailerService();
            mailerService.sendConfirmationMail(user.email, user.username, user.emailVerified, user.lang);

            return;

        } catch(e) {
            throw(e);
        }

    }


    /**
     * Authenticate user
     * 
     * @param loginRequest 
     * @returns
     */
    public async login(loginRequest: LoginRequest): Promise<any>{

        let userRecord = await UserDao.getUserByEmail(loginRequest.email);

        if(!userRecord) throw new Error('EMAIL_NOT_FOUND'); //unexisting user
        
        if (process.env.REQUIRE_EMAIL_VERIFY != "false" && userRecord.emailVerified != 'verified')
            throw new Error('EMAIL_NOT_VERIFIED') ;  //unverified user

        const validPassword = await argon2.verify(userRecord.password, loginRequest.password);

        if(!validPassword) throw new Error('INVALID_PASSWORD'); //wrong password

        //set cookie for login
        const cookie = guid();

        userRecord = await UserDao.updateUser(userRecord as User, {cookie: cookie});
        
        if(!userRecord) throw new Error('Cannot set cookie'); //unexisting user

        const user = userRecord.toObject();
        
        Reflect.deleteProperty(user, 'password');
        Reflect.deleteProperty(user, 'salt');

        return user;
    }

    
    /**
     * Checks if user with a given email exists
     * 
     * @param email 
     * @returns
     */
    public async findByEmail(email: string): Promise<any>{
        return await UserModel.findOne({email: email});
    }


    /**
     * Checks if user with a given username exists
     * 
     * @param email 
     * @returns
     */
    public async findByUsername(username: string): Promise<any>{  
        return await UserModel.findOne({username: username});
    }


    /**
     * Checks if user with a given username exists
     * 
     * @param email 
     * @returns
     */
     public async findById(_id: string): Promise<any>{  
        return await UserDao.getUserById(_id);
    }


    /**
     * Sends a reset password email
     * 
     * @param email 
     * @returns
     */
    public async sendResetPasswordEmail(email: string): Promise<any>{

        try{
            const user: User = await UserDao.getUserByEmail(email);

            const userRecord = await UserDao.updateUser(user, {passKey: guid()});

            if(!userRecord) throw new Error('EMAIL_NOT_FOUND');

            const mailerService = new MailerService();

            mailerService.sendResetPasswordEmail(userRecord.toObject().email, userRecord.toObject().username, userRecord.toObject().passKey, userRecord.toObject().lang);

            return;

        } catch(e) {
            throw(e);
        }
    }


    /**
     * Validate a passkey
     * 
     * @param email 
     * @returns
     */
    public async validatePassKey(key: string): Promise<any>{

        try{       
            const userRecord = await UserDao.getUserByPassKey(key);

            if(!userRecord) throw new Error('INVALID_PASS_KEY');

            return;

        }catch(e){
            throw(e);
        }
    }


    /**
     * Updates user with a new password
     * 
     * @param key 
     * @param password  new password
     * @returns
     */
    public async resetPassword(key: string, password: string): Promise<any>{

        try{
            const salt = randomBytes(32);
            const hashedPassword = await argon2.hash(password, { salt });

            const user: User = await UserDao.getUserByPassKey(key);
            if(!user) throw new Error('INVALID_PASS_KEY');

            const userRecord = await UserDao.updateUser(user, {password: hashedPassword});
            if(!userRecord) throw new Error('INVALID_PASS_KEY');
            
            return;

        }catch(e){

            throw(e);
        }

    }


    /**
     * Push refresh token into db
     * 
     * @param refreshToken    refresh token  
     * @returns
     */
     public async pushRefreshToken(refreshToken: string): Promise <any>{

        const result = await RefreshTokenDao.push(refreshToken);

        if (!result) throw new Error('Database error');
        
        return result;     
    }


    /**
     * Push refresh token into db
     * 
     * @param refreshToken    refresh token  
     * @returns
     */
     public async getRefreshToken(refreshToken: string): Promise <any>{

        const result = await RefreshTokenDao.getRefreshToken(refreshToken);

        if (!result) throw new Error('Not found');
        
        return result;     
    }
}

