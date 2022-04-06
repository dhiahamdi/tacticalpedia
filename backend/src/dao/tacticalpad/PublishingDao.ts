import { Publishing } from "../../interfaces/tacticalpad/publishing";
import { TrainingFile } from "../../interfaces/training/training-file";
import publishingModel from "../../models/tacticalpad/publishing";

export default class PublishingDao {

    constructor(){}

    public static async create(publishing: Publishing): Promise<Publishing> {      
        return await publishingModel.create(publishing);
    }

    public static async updateByIntId(projectId: number, publishing:Publishing): Promise<Publishing>{
        return await publishingModel.findOneAndUpdate({int_id: projectId}, {$set: publishing}, {returnOriginal: false});
    }


    public static async attachFile(publishingId: string, attached_file: TrainingFile): Promise<Publishing> {      
        return await publishingModel.findByIdAndUpdate( publishingId, { $push: { files: attached_file } }, {returnOriginal: false});
    }

    public static async getById(publishingId: string): Promise<Publishing> {      
        return await publishingModel.findById( publishingId);
    }

    public static async getByIntId(publishingId: number): Promise<Publishing> {      
        return await publishingModel.findOne( {int_id: publishingId});
    }

    public static async getByProjectId(proj_id: number): Promise<Publishing> {      
        return await publishingModel.findOne( {'source_project.project_id': proj_id});
    }

    public static async deletePublishingById(publishingId: string){
        return await publishingModel.findByIdAndRemove(publishingId);
    }

}