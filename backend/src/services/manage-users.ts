import TrainingDao from "../dao/TrainingDao";
import UserDao from "../dao/UserDao";
import { User } from "../interfaces/user";
import MailerService from "./mailer";


export default class ManageUsersService {

    /**
     * Retrieves all the users
     * 
     * @param user  
     * @param paypalUser
     * @returns 
     */
     public async getUsers(): Promise<any> {

        try{

            const usersRecord = await UserDao.getUsers();

            if(!usersRecord) throw new Error('Unable to save subscription');

            return usersRecord;

        }catch(e){
            throw(e);
        }
    }


    /**
     * Retrieves a specific user by its id
     * 
     * @param user  
     * @param paypalUser
     * @returns 
     */
     public async getUser(user_id: string): Promise<any> {

        try {

            const userRecord = await UserDao.getUserById(user_id);

            if(!userRecord) throw new Error('Unable to save subscription');

            return userRecord;

        } catch(e) {
            throw(e);
        }
    }


    /**
     * Updates user with info given by the admin
     * 
     * @param user  
     * @param paypalUser
     * @returns 
     */
     public async updateUser(updatedUser): Promise<any> {

        try {

            const actualUser = await UserDao.getUserById(updatedUser._id) as User;

            if(!actualUser) throw new Error('Unable to find user');

            const updatedRecord = UserDao.updateUser(actualUser, {
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.userRole,
                canPublish: updatedUser.canPublish,
                emailVerified: this.getEmailVerifiedValue(actualUser, updatedUser),
                profile: {
                    name: updatedUser.name,
                    surname: updatedUser.surname,
                    address: updatedUser.address ? updatedUser.address : '',
                    role: updatedUser.role,
                    discipline: updatedUser.discipline,
                    qualification: updatedUser.qualification
                }     
            });

            return updatedRecord;

        } catch(e) {
            throw(e);
        }
    }


    /**
     * Returns the email verified field based on the current user value and the new one.
     * It may send a new confirmation email to the user.
     * 
     * @param actualUser User
     * @param updatedUser
     * @returns 
     */
    getEmailVerifiedValue(actualUser: User, updatedUser): string {

        //function user to generate random string for email verification
        const guid = function(){return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {var r = Math.random()*16|0,v=c=='x'?r:r&0x3|0x8;return v.toString(16);});}

        if (updatedUser.emailVerified == 'yes') {
            return 'verified';

        } else if ( updatedUser.emailVerified == 'no' && actualUser.emailVerified != 'verified') {
            return actualUser.emailVerified;

        } else if ( updatedUser.emailVerified == 'no' && actualUser.emailVerified == 'verified') {

            //send confirmation Email
            const mailerService = new MailerService();
            const guid_value = guid();
            mailerService.sendConfirmationMail(updatedUser.email, updatedUser.username, guid_value, updatedUser.lang);

            return guid_value;
        } 

    }
    public async searchUserByMail(user_mail : string): Promise<any> {

        try{

            const usersRecord = await UserDao.searchUserByEmail(user_mail);

            if(!usersRecord) throw new Error('Unable to find user ');

            return usersRecord;

        }catch(e){
            throw(e);
        }
    }


    /**
     * Delete user and assign trainings to another user.
     * If new_user_id is null, then the trainings will be deleted permanentely.
     * 
     * @param user_id   User to delete 
     * @param new_user_id   User that will receive the new trainings
     * @returns 
     */
     public async deleteUser(user_id: string, new_user_id: string | null): Promise<any> {

        // Get user to delete
        const user = await UserDao.getUserById(user_id) as User;
        if (!user) throw new Error('Unable to find user');
        
        if (new_user_id) {

            // Assign trainings to new user
            const new_user = await UserDao.getUserById(new_user_id) as User;
            if (!new_user) throw new Error('Unable to find new user');

            const t_result = await TrainingDao.changeTrainingOwner(user_id, new_user_id);
            if (!t_result) throw new Error('Can\'t assign trainings to new user');

        } else {

            // Delete trainings
            const t_result = await TrainingDao.deleteTrainingsByOwner(user_id);
            if (!t_result) throw new Error('Can\'t delete user trainings');
        }

        const result = await UserDao.deleteUserById(user_id);
        if (!result) throw new Error('Can\'t delete user');

        return result;
            
     }

}