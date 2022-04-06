import { Page } from "../../interfaces/tacticalpad/page";
import { TrainingFile } from "../../interfaces/training/training-file";
import pageModel from "../../models/tacticalpad/page";


export default class PageDao {

    constructor(){}

    public static async create(page: Page): Promise<Page> {      
        return await pageModel.create(page);
    }

    public static async attachFile(pageId: string, attached_file: TrainingFile): Promise<Page> {      
        return await pageModel.findByIdAndUpdate(pageId, { $push: { files: attached_file } }, {returnOriginal: false});
    }

    public static async getByPublishingId(publishing_id: string): Promise<Page[]> {
        return await pageModel.find({publishing_id: publishing_id});
    }

    public static async getById(page_id: string): Promise<Page> {      
        return await pageModel.findById(page_id);
    }

    public static async getByInternalBoardId(internalBoardId: string): Promise<Page> {      
        return await pageModel.findOne({internal_board_id: internalBoardId});
    }

    public static async updateByInternalBoardId(internalBoardId: string, page: Page): Promise<Page> {      
        return await pageModel.findOneAndUpdate({internal_board_id: internalBoardId}, {$set:page}, {returnOriginal: false});
    }

    public static async deletePageById(pageId: string){
        return await pageModel.findByIdAndRemove(pageId);
    }


}