import { environment } from "../../../config/config";
import TrainingDao from "../../../dao/TrainingDao";
import { Training } from "../../../interfaces/training/training";
import UserModel from "../../../models/user";

const privateTraining = async (req, res, next) => {

    try{
        
        const trainingId = req.body._id;

        if(!trainingId) return res.status(400).send();

        const training = await TrainingDao.getFromId(trainingId)

        if(!training) return res.status(400).send();

        if (req.body.options && req.body.options.ck && req.body.options.ck == process.env.FRONTEND_KEY)  {
            req.training = training;
            next();
        }

        if(training.visibility === 'private'){
            //check login

            if(!req.cookies.login) return res.status(401).send({message: 'AUTH_NEEDED'});

            const userRecord = await UserModel.findOne({cookie: req.cookies.login});

            if(!userRecord) return res.status(401).send();
            
            //check if private training belongs to logged user
            else if(String(userRecord._id) !== String(training.user_id)) return res.status(401).send();

        }

        req.training = training;
        
        next();

    }catch(e){

        return res.status(400).send({message: e.message});
    }

}

export default privateTraining;
