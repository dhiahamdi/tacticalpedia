import express from 'express'
import { Training } from '../../../interfaces/training/training';
import FileManagerService from '../../../services/file-manager';
import TrainingService from '../../../services/training';
import ownerTraining from '../middlewares/ownerTraining';
import ownerTrainings from '../middlewares/ownerTrainings';
import privateTraining from '../middlewares/privateTraining';

const router = express.Router()

var upload = new FileManagerService('training').upload;

router.post('/insert', async (req, res) =>{

    const trainingService = new TrainingService();

    try{

        req.body.user_id = req.loggedUser._id;

        const training = await trainingService.insertTraining(req.body as Training);

        return res.status(200).json({trainingId: training._id});

    }catch(e){

        return res.status(400).send({message: e.message});
    }

});


router.post('/edit', ownerTraining,  async (req, res) =>{

    const trainingService = new TrainingService();

    try{

        req.body.user_id = req.loggedUser._id;
        req.body.draft = false;

        const trainingId = await trainingService.editTraining(req.body._id, req.body as Training);

        return res.status(200).json({trainingId: trainingId});


    }catch(e){

        return res.status(400).send({message: e.message});
    }

});

router.post('/delete', ownerTrainings, async (req, res) => {

    const trainingService = new TrainingService();

    try{

        await trainingService.deleteTrainings(req.body.trainingIds);

        return res.status(200).json({response: 'training deleted'});


    }catch(e){

        return res.status(400).send({message: e.message});
    }
});


router.post('/insert-draft', async (req,res) =>{

    const trainingService = new TrainingService();

    try{

        req.body.user_id = req.loggedUser._id;
        req.body.draft = true;

        const training = await trainingService.insertTraining(req.body as Training);

        return res.status(200).json({trainingId: training._id});

    }catch(e){

        return res.status(400).send({message: e.message});
    }
});


router.post('/add-images', upload.array('file', 25), ownerTraining, async (req, res) => {


    const trainingService = new TrainingService();

    try{
        let imagePaths = []
        
        for(let file of (req as any).files){
            imagePaths = [...imagePaths, String(file.path)];
        }

        await trainingService.addImagesToTraining(req.body._id, imagePaths);

        return res.status(200).json({response: 'image added to training'});

    }catch(e){

        return res.status(400).send({message: e.message});
    }

});


router.post('/delete-imgs', ownerTraining, async(req,res) =>{

    const trainingService = new TrainingService();

    try{

        await trainingService.deleteImagesFromTraining(req.body._id);

        return res.status(200).json({response: 'images deleted from training'});

    }catch(e){

        return res.status(400).send({message: e.message});
    }
})

router.post('/delete-files', ownerTraining, async(req,res) =>{

    const trainingService = new TrainingService();

    try{

        await trainingService.deleteFilesFromTraining(req.body._id);

        return res.status(200).json({response: 'images deleted from training'});

    }catch(e){

        return res.status(400).send({message: e.message});
    }
})



router.post('/add-files', upload.array('file', 10), ownerTraining, async (req, res) => {

    const trainingService = new TrainingService();

    try{
        let files = []
        
        for(let file of (req as any).files){
            
            files = [...files, {name: file.originalname, path: String(file.path)}];
        }

        await trainingService.addFilesToTraining(req.body._id, files);

        return res.status(200).json({response: 'image added to training'});

    }catch(e){

        return res.status(400).send({message: e.message});
    }

});

router.get('/trainings', async (req, res) =>{

    const trainingService = new TrainingService();

    try{

        const trainings = await trainingService.getTrainings(req.loggedUser);

        return res.status(200).json(trainings ? trainings : []);


    }catch(e){

        res.status(400).send({message: e.message});
    }

});


router.get('/drafts', async(req, res) => {

    const trainingService = new TrainingService();

    try{

        const drafts = await trainingService.getDrafts(req.loggedUser);

        return res.status(200).json(drafts ? drafts : []);


    }catch(e){

        return res.status(400).send({message: e.message});
    }

});




export default router