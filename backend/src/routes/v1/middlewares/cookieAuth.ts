import TrainingDao from "../../../dao/TrainingDao";
import { Training } from "../../../interfaces/training/training";
import { User } from "../../../interfaces/user";
import UserModel from "../../../models/user";

const cookieAuth = async (req, res, next) => {

    try{

        const cookie = req.body.ck;

        if (!cookie) return res.status(401).send({message: 'AUTH_NEEDED'});

        const userRecord = await UserModel.findOne({cookie: cookie});

        if(!userRecord) return res.status(401).send({message: 'AUTH_NEEDED'});
        
        req.loggedUser = userRecord.toObject() as User;
    
        next();

    }catch(e){

        return res.status(400).send({message: e.message});
    }

}

export default cookieAuth;
