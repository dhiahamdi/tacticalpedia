import PageDao from "../dao/tacticalpad/PageDao";
import PublishingDao from "../dao/tacticalpad/PublishingDao";
import TrainingDao from "../dao/TrainingDao";
import { Training } from "../interfaces/training/training";
import { TrainingFile } from "../interfaces/training/training-file";
import { User } from "../interfaces/user";
import FileManagerService from "./file-manager";
import MailerService from "./mailer";
import TacticalpadService from "./tacticalpad/tacticalpad";


export default class TrainingService {


    constructor(){}

    /**
     * Insert a new training
     * 
     * @param training: Training
     * @return
     */
    async insertTraining(training: Training): Promise<Training>{

        try{
            const trainingRecord = await TrainingDao.createTraining(training);

            if(!trainingRecord) throw new Error('Unable to create training');

            // Send email to admin
            const mailerService = new MailerService();
            mailerService.sendAdminNewTraining(trainingRecord._id, trainingRecord.name);

            return trainingRecord;

        }catch(e){
            throw(e);
        }
        
    }


    async editTraining(trainingId: string, training: Training): Promise<string>{

        try{

            const trainingRecord = await TrainingDao.editTraining(trainingId, training);

            if(!trainingRecord) throw new Error('Unable to edit training');

            return trainingRecord.toObject()._id.toString()


        }catch(e){
            throw(e);
        }
    }

    async deleteTrainings(trainingIds: string[]): Promise<void>{

        const tacticalpadService = new TacticalpadService();

        try{
            for(let id of trainingIds){
                //fetch images path before removing them from db
                let trainingRecord = await TrainingDao.getFromId(id);

                //fetch tacticalpad publishings
                if ('tacticalpad_publishing_id' in trainingRecord && trainingRecord.tacticalpad_publishing_id)
                    tacticalpadService.deletePage(trainingRecord.tacticalpad_publishing_id);

                await TrainingDao.deleteTrainingById(id);

                //delete images and files from server
                await FileManagerService.removeFiles(trainingRecord.image);
                await FileManagerService.removeFiles(trainingRecord.files.map(f => f.path));

            }
        }catch(e){

            throw(e);
        }
    }

    async addImagesToTraining(trainingId: string, filePaths: string[]): Promise<void>{

        try{

            let trainingRecord = await TrainingDao.getFromId(trainingId);

            await FileManagerService.removeFiles(trainingRecord.image);

            trainingRecord = await TrainingDao.addImages(trainingId, filePaths);

            if(!trainingRecord) throw new Error('Unable to add image to training');

            return;


        }catch(e){

            throw(e);
        }
    }

    async deleteImagesFromTraining(trainingId: string): Promise<void>{

        try{
            //fetch images path before removing them from db
            let trainingRecord = await TrainingDao.getFromId(trainingId);

            const result = await TrainingDao.removeImages(trainingId);

            if(!result) throw new Error('Unable to delete images from training');

            //delete images from server
            await FileManagerService.removeFiles(trainingRecord.image);

            return;


        }catch(e){
            throw(e);
        }
    }

    async addFilesToTraining(trainingId: string, files: TrainingFile[]):Promise<void>{

        try{
            //remove previous files from server
            let trainingRecord = await TrainingDao.getFromId(trainingId);

            await FileManagerService.removeFiles(trainingRecord.files.map(f => f.path));

            trainingRecord = await TrainingDao.addFiles(trainingId, files);

            if(!trainingRecord) throw new Error('Unable to add files');

            return;


        }catch(e){

            throw(e);
        }
    }

    async deleteFilesFromTraining(trainingId: string): Promise<void>{

        try{
            //fetch images path before removing them from db
            let trainingRecord = await TrainingDao.getFromId(trainingId);

            const result = await TrainingDao.removeFiles(trainingId);

            if(!result) throw new Error('Unable to delete images from training');

            //delete images from server

            await FileManagerService.removeFiles(trainingRecord.files.map(f => f.path));

            return;


        }catch(e){
            throw(e);
        }
    }

    async getTrainings(user: User): Promise<Training[]>{

        try{

            let trainingsList = await TrainingDao.getTrainings(user);

            if(!trainingsList) throw new Error('Unable to fetch trainings');

            trainingsList = trainingsList.filter(training => !training.draft);


            return trainingsList;

        }catch(e){

            throw(e);
        }
    }

    async getPublicTrainings(filters): Promise<Training[]>{

        try{

            let trainingList = await TrainingDao.getPublicTrainings();

            if(!trainingList) throw new Error('Unable to fetch public trainings');

            trainingList = trainingList.filter((training) =>{
            const categotyCond: boolean = (filters.category) ? training.category.map(category => category.slug).indexOf(filters.category) != -1 : true;
            const searchTextCond: boolean = (filters.search) ? 
        
                training.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                training.description.toLowerCase().includes(filters.search.toLowerCase())
                : true;
        
            let taxonomiesCond: boolean = true;
        
            if(filters.selectTaxonomies){
        
                Object.keys(filters.selectTaxonomies).forEach((key) =>{
        
                let selected = filters.selectTaxonomies[key];
        
                for(let selectT of training.selectTaxonomies){
        
                    if(selectT.name === key){
                    let tempCond = (selected) ? selectT.value.indexOf(selected) != -1  : true;
                    taxonomiesCond = taxonomiesCond && tempCond;
                    } 
                }
                });
            }
        
            return categotyCond && searchTextCond && taxonomiesCond
        
            });
                
 
            trainingList = trainingList.filter(training => !training.draft);

            return trainingList;

        }catch(e){
            throw(e);
        }
    }

    async getUserPublicTrainings(user_id: string): Promise<Training[]>{

        try{
            let trainingList = await TrainingDao.getUserPublicTrainings(user_id);

            if(!trainingList) throw new Error('Unable to fetch user public trainigs');

            trainingList = trainingList.filter(training => !training.draft);

            return trainingList;

        }catch(e){

            throw(e);
        }
    }

    async getDrafts(user: User): Promise<Training[]>{

        try{

            const draftsList = await TrainingDao.getDrafts(user);

            if(!draftsList) throw new Error('Unable to fetch training drafts');

            return draftsList;


        }catch(e){

            throw(e);
        }
    }

    async getImgPath(trainingId: string): Promise<string>{

        try{

            const trainingImgPath = await TrainingDao.getImgPath(trainingId);

            if(!trainingImgPath) throw new Error('Unable to get img path');

            return trainingImgPath;


        }catch(e){

            throw(e);
        }
    }

    async getTrainingFromId(trainingId: string): Promise<Training>{

        try{

            const training = await TrainingDao.getFromId(trainingId);

            if(!training) throw new Error('Unable to find training');

            return training;

        }catch(e){

            throw(e);
        }
    }

    async getTrainingCover(trainingId: string): Promise<string> {

        try {

            const training = await TrainingDao.getFromId(trainingId);

            if(!training) throw new Error('Unable to find training');

            let imageExt;

            //search video in tacticalpad
            if(training.tacticalpad_publishing_id){

                //get related page
                const page = await PageDao.getById(training.tacticalpad_publishing_id);

                // search video in tacticalpad
                for(let f of page.files){
                    imageExt = await FileManagerService.getFileExtension(f.path);
                    if(imageExt ===".mp4" || imageExt ===".mov") 
                        return f.path;
                }
            }

            // search video in training
            for(let image of training.image){
                imageExt = await FileManagerService.getFileExtension(image);
                if(imageExt ===".mp4" || imageExt ===".mov") 
                    return image;  
            }


            //search image in tacticalpad
            if(training.tacticalpad_publishing_id) {

                //get related page
                const page = await PageDao.getById(training.tacticalpad_publishing_id);

                for(let f of page.files){
                    imageExt = await FileManagerService.getFileExtension(f.path);
                    if(imageExt ===".png" || imageExt ===".jpg" || imageExt ===".jpeg" || imageExt ===".gif") 
                        return f.path;
                }
            }

             //search image in training
             for(let image of training.image){
                imageExt = await FileManagerService.getFileExtension(image);
                if(imageExt ===".png" || imageExt ===".jpg" || imageExt ===".jpeg" || imageExt ===".gif") 
                    return image;  
            }

            return;

        }catch(e){

            throw(e);
        }
    }


    async getTacticalpadVideoThumb(trainingId: string) {

        const training = await TrainingDao.getFromId(trainingId);

        if(!training) throw new Error('Unable to find training');

        let imageExt;

        if (!training.tacticalpad_publishing_id) throw new Error('Unable to find tacticalpad publishing');

        const page = await PageDao.getById(training.tacticalpad_publishing_id);

        if (!page) throw new Error('Unable to find tacticalpad page');

         // search image in training
        for(let f of page.files){
            imageExt = await FileManagerService.getFileExtension(f.path);
            if(imageExt ===".png" || imageExt ===".jpg" || imageExt ===".jpeg" || imageExt ===".gif") 
                return f.path;
        }

        return false;
        
    }


    async getTrainingByPublishingId(publishing_id: string): Promise<Training>{

        try{

            const training = await TrainingDao.getFromPublishingId(publishing_id);

            if(!training) throw new Error('Unable to find training');

            return training;

        }catch(e){

            throw(e);
        }
    }

    async getImgPathsFromTacticalpadPublishing(tacticalpad_publishing_id: string): Promise<string[]>{

        try{
            let paths = [];

            //get tacticalpad page by ID
            const page = await PageDao.getById(tacticalpad_publishing_id);

            //there is a pages
            if(page){

                for(let f of page.files){

                    let ext = await FileManagerService.getFileExtension(f.path);

                    if(ext === ".jpg" || ext === ".jpeg" || ext === ".png" || ext === ".mp4") paths = [...paths, f.path];
                }
            }

            return paths;
            

        }catch(e){

            throw(e);
        }

    }


    async getFilePathsFromTacticalpadPublishing(tacticalpad_publishing_id: string): Promise<TrainingFile[]>{

        try{
            let paths = [];

            //check if publishing contains pages
            const page = await PageDao.getById(tacticalpad_publishing_id);

            //there are some pages
            if(page){

                for(let f of page.files){

                    let ext = await FileManagerService.getFileExtension(f.path);

                    if(ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png" && ext !== ".mp4") paths = [...paths, {name: f.name, path: f.path}];
                }
                
            }

            return paths;
            

        }catch(e){

            throw(e);
        }

    }

}