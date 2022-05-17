import { Training } from "../interfaces/training/training";
import TrainingModel from "../models/training";
import mongoose from 'mongoose';
import { User } from "../interfaces/user";
import { TrainingFile } from "../interfaces/training/training-file";

export default class TrainingDao {

    constructor() { }

    public static async createTraining(training: Training) {
        return await TrainingModel.create(training);
    }


    public static async editTraining(trainingId: string, training: Training) {
        return await TrainingModel.findByIdAndUpdate(trainingId, training, { returnOriginal: false });
    }


    public static async changeTrainingOwner(owner_id: string, new_owner_id: string) {
        return await TrainingModel.updateMany({ user_id: mongoose.Types.ObjectId(owner_id) }, { user_id: mongoose.Types.ObjectId(new_owner_id) });
    }

    /**
    * Deletes a training with a given filter
    *
    * @param filter 
    */
    public static async deleteTrainingsByOwner(user_id: string) {
        return await TrainingModel.deleteMany({ user_id: mongoose.Types.ObjectId(user_id) });
    }


    public static async deleteTrainingById(trainingId: string) {
        return await TrainingModel.findByIdAndRemove(trainingId);
    }


    public static async addImages(trainingId: string, filePaths: string[]) {

        const id = mongoose.Types.ObjectId(trainingId);

        return await TrainingModel.findByIdAndUpdate(id,
            { $set: { image: filePaths } }, { returnOriginal: false });
    }


    public static async removeImages(trainingId: string) {

        const id = mongoose.Types.ObjectId(trainingId);

        return await TrainingModel.findByIdAndUpdate(id,
            { $set: { image: [] } }, { returnOriginal: false });
    }


    public static async addFiles(trainingId: string, files: TrainingFile[]) {

        const id = mongoose.Types.ObjectId(trainingId);

        return await TrainingModel.findByIdAndUpdate(id,
            { $set: { files: files } }, { returnOriginal: false });

    }


    public static async removeFiles(trainingId: string) {

        const id = mongoose.Types.ObjectId(trainingId);

        return await TrainingModel.findByIdAndUpdate(id,
            { $set: { files: [] } }, { returnOriginal: false });

    }


    public static async getTrainings(user: User): Promise<Training[]> {
        return await TrainingModel.find({ user_id: user._id })
            .populate({ path: 'groups', select: ['name'] });
    }

    public static async getTrainingsbyids(ids: string[]): Promise<Training[]> {
        return await TrainingModel.find({ _id:  { "$in" : ids } }).sort({ date: -1 });
    }


    public static async getPublicTrainings(): Promise<Training[]> {
        return await TrainingModel.find({ visibility: 'public' }).sort({ date: -1 });
    }


    public static async getUserPublicTrainings(user_id: string): Promise<Training[]> {
        return await TrainingModel.find({ user_id: user_id });
    }


    public static async getDrafts(user: User): Promise<Training[]> {
        return await TrainingModel.find({ user_id: user._id, draft: true });
    }


    public static async getImgPath(trainingId: string): Promise<string> {

        const id = mongoose.Types.ObjectId(trainingId);

        const trainingRecord = await TrainingModel.findById(id);

        const training = trainingRecord.toObject();

        return training.image[0];
    }


    public static async getFromId(trainingId: string): Promise<Training> {

        const id = mongoose.Types.ObjectId(trainingId);

        const trainingRecord = await TrainingModel.findById(id);

        return trainingRecord;
    }



    public static async getFromPublishingId(publishing_id: string): Promise<Training> {

        const trainingRecord = await TrainingModel.findOne({ tacticalpad_publishing_id: publishing_id });

        return trainingRecord;
    }
}