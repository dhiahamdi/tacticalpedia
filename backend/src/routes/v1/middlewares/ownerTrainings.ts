import TrainingDao from "../../../dao/TrainingDao";
import { Training } from "../../../interfaces/training/training";

const ownerTrainings = async (req, res, next) => {

    try{

        const trainingIds = req.body.trainingIds;

        if(!trainingIds) return res.status(400).send();

        let training: Training;

        for(let id of trainingIds){

            training = await TrainingDao.getFromId(id);

            if(String(training.user_id) !== String(req.loggedUser._id)) {
                return res.status(401).send();
            }
        }
        
        next();

    }catch(e){

        return res.status(400).send({message: e.message});
    }

}

export default ownerTrainings;