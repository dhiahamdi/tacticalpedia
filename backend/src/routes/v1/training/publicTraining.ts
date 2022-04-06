import express from 'express'
import TrainingDao from '../../../dao/TrainingDao';
import { Training } from '../../../interfaces/training/training';
import UserModel from '../../../models/user';
import HelperService from '../../../services/helper';
import TrainingService from '../../../services/training';
import privateTraining from '../middlewares/privateTraining';

var html_to_pdf = require('html-pdf-node');

const router = express.Router()


// router.get('/public-trainings', async (req, res) =>{

//     const trainingService = new TrainingService();

//     try{
//         const trainings = await trainingService.getPublicTrainings();

//         return res.status(200).json(trainings ? trainings : []);

//     }catch(e){

//         res.status(400).send({message: e.message});
//     }

// });

/**
 * lazy loading of training for home and profile
 */
router.post('/public-trainings/lazy/:page_number/amount/:page_amount', async (req, res) =>{

    const trainingService = new TrainingService();
    console.log(req.body);
    try{
        console.log(req.body.filters)
        const trainings = await trainingService.getPublicTrainings(req.body.filters);

        const page = parseInt(req.params.page_number) - 1;
        const pageAmount = parseInt(req.params.page_amount);

        const found = trainings.slice(page * pageAmount, (page + 1) * pageAmount);

        return res.status(200).json(found ? found : []);

    }catch(e){
        console.log(e);
        res.status(400).send({message: e.message});
    }

});

/**
 * get user public trainings
 */
router.post('/user-public-trainings', async(req, res) =>{

    const trainingService = new TrainingService();

    try{
        const trainings = await trainingService.getUserPublicTrainings(req.body.user_id);

        return res.status(200).json(trainings ? trainings : []);

    }catch(e){

        return res.status(400).send({message: e.message});
    }

});

router.post('/img', privateTraining,  async (req, res) => {

    try{

        return res.status(200).sendFile(String(req.body.imagePath));

    }catch(e){

        return res.status(400).send({message: e.message});
    }

});


router.post('/file', privateTraining, async (req, res)=>{

    const trainingService = new TrainingService();

    try{

        return res.status(200).sendFile(String(req.body.filePath));


    }catch(e){

        return res.status(400).send({message: e.message});
    }
})


router.post('/from-id', privateTraining, async(req, res) => {

    const trainingService = new TrainingService();

    try{

        return res.status(200).json(req.training);

    }catch(e){

        return res.status(400).send({message: e.message});
    }

});

router.post('/cover-img', privateTraining, async(req, res) => {

    const trainingService = new TrainingService();

    try{
        
        const trainingCover = await trainingService.getTrainingCover(req.body._id);

        if(!trainingCover) return res.status(200).sendFile(HelperService.getAssetPath('images/default-image.jpg'))

        return res.status(200).sendFile(trainingCover);

    }catch(e){
        console.log(e);
        return res.status(400).send({message: e.message});
    }
});


router.post('/cover-video-thumb', privateTraining, async(req, res) => {

    const trainingService = new TrainingService();

    try{
        
        const trainingCover = await trainingService.getTacticalpadVideoThumb(req.body._id);

        if(!trainingCover) return res.status(200).sendFile(HelperService.getAssetPath('images/default-image.jpg'))

        return res.status(200).sendFile(trainingCover);

    }catch(e){

        return res.status(404).send({message: e.message});
    }
});

router.post('/tacticalpad-img-paths', privateTraining, async(req, res) => {

    const trainingService = new TrainingService();

    try{
        
        const tacticalPediaImgPaths = await trainingService.getImgPathsFromTacticalpadPublishing(req.body.tacticalpad_publishing_id);

        return res.status(200).json(tacticalPediaImgPaths);

    }catch(e){

        return res.status(400).send({message: e.message});
    }
});


router.post('/tacticalpad-file-paths', privateTraining, async(req, res) => {

    const trainingService = new TrainingService();

    try{
        
        const tacticalPediaFilePaths = await trainingService.getFilePathsFromTacticalpadPublishing(req.body.tacticalpad_publishing_id);

        return res.status(200).json(tacticalPediaFilePaths);

    }catch(e){

        return res.status(400).send({message: e.message});
    }
});


router.get('/pdf/:training_id', async(req, res) => {

    try{

        // Doing a custom middleware

        const trainingId = req.params.training_id;

        if(!trainingId) return res.status(400).send();

        const training = await TrainingDao.getFromId(trainingId);

        if (training.visibility == 'private') {
            
            if(!req.cookies.login) return res.status(401).send({message: 'AUTH_NEEDED'});

            const userRecord = await UserModel.findOne({cookie: req.cookies.login});

            if(!userRecord) return res.status(401).send();

             //check if private training belongs to logged user
             else if(String(userRecord._id) !== String(training.user_id)) return res.status(401).send();

        }

        let options = { format: 'A4' };

        let file = {url: process.env.FRONT_END_URL + `training/${trainingId}?pdf=1&ck=${process.env.FRONTEND_KEY}&lang=${req.query.lang}`};

        html_to_pdf.generatePdf(file, options).then(pdfBuffer => {
            res.header('Content-type', 'application/pdf')
            res.status(200).send(pdfBuffer);
        });

    }catch(e){

        return res.status(400).send({message: e.message});
    }

});


function getPdfContent(params) {
    return `
        <style>
        .logo {
            width: 100%;
        }
        </style>
        <img class="logo" src="https://tacticalpedia.polarispartner.com/assets/images/logos/TacticalpediaBluLungo.jpg">
        
        <h1>Title here</h1>
        <h2>From Author</h2>

        <video preload="metadata">
            <source src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4">
        </video>
        `;
}

export default router;