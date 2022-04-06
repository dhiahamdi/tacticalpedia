import { User } from "../../../interfaces/user";
import UserModel from "../../../models/user";

const isAuth = async (req, res, next) => {

    if(!req.cookies.login) return res.status(401).send({message: 'AUTH_NEEDED'});

    const userRecord = await UserModel.findOne({cookie: req.cookies.login});

    if(!userRecord) {
        res.clearCookie('login');
        return res.status(401).send({message: 'AUTH_NEEDED'});
    }

    req.loggedUser = userRecord.toObject() as User;
    
    next();

}

export default isAuth;