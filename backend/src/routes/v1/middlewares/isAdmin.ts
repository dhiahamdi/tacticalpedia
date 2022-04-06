import { User } from "../../../interfaces/user";
import UserModel from "../../../models/user";

const isAdmin = async (req, res, next) => {

    try{

        if(!req.cookies.login) return res.status(404).send();

        const userRecord = await UserModel.findOne({cookie: req.cookies.login});

        if(!userRecord) {
            res.clearCookie('login');
            return res.status(404).send();
        }

        const loggedUser = userRecord.toObject() as User;

        if(loggedUser.role != 'admin') {
            return res.status(404).send();
        }
        
        next();

    }catch(e){
        res.status(400).send({message: e.message});
    }

}

export default isAdmin;