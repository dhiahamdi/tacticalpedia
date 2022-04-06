import TrainingDao from "../../../dao/TrainingDao";
import { Training } from "../../../interfaces/training/training";

const ownerTraining = async (req, res, next) => {

    try{
        
        const trainingId = req.body._id;

        if(!trainingId) return res.status(400).send();

        const training = await TrainingDao.getFromId(trainingId)

        //check if  training belongs to logged user
        if(training.visibility === 'private' && String(req.loggedUser._id) !== String(training.user_id)) return res.status(401).send();

        req.training = training;
        
        next();

    }catch(e){

        return res.status(400).send({message: e.message});
    }

}

export default ownerTraining;