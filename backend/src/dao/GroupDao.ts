import { Training } from "../interfaces/training/training";
import { Group } from "../interfaces/groups/Group";
import GroupModel from "../models/Group";
import UserModel from "../models/user";
import mongoose from 'mongoose';
import { User } from "../interfaces/user";

export default class GroupDao {

    constructor() { }

    public static async create(group: Group) {
        return await GroupModel.create(group);
    }


    public static async edit(groupId: string, group: Group) {
        return await GroupModel.findByIdAndUpdate(groupId, group, { returnOriginal: false });
    }


    public static async deleteById(Id: string) {
        return await GroupModel.findByIdAndRemove(Id);
    }


    public static async addImages(Id: string, filePaths: string) {

        const id = mongoose.Types.ObjectId(Id);

        return await GroupModel.findByIdAndUpdate(id,
            { $set: { img: filePaths } }, { returnOriginal: false });
    }


    public static async removeImages(Id: string) {

        const id = mongoose.Types.ObjectId(Id);

        return await GroupModel.findByIdAndUpdate(id,
            { $set: { img: "" } }, { returnOriginal: false });
    }




    public static async getAll(): Promise<Group[]> {
        return await GroupModel.find()
           .populate({ path: 'authors', select: ['profile'] })
            //.populate({ path: 'trainings', select: ['image','category'] })
    }

    public static async getUserGroup(userId : string): Promise<Group[]> {
        return await GroupModel.find({authors : userId })
        .populate({ path: 'authors', select: ['profile' , 'email'] } )
        .populate( { path: 'subsciptions', select: ['profile' , 'email'] })
    }
    public static async getUserGroupSubs(userId : string): Promise<Group[]> {
        return await GroupModel.find({subsciptions : userId }).populate({ path: 'authors', select: ['profile'] })
    }



    public static async getImgPath(Id: string): Promise<string> {

        const id = mongoose.Types.ObjectId(Id);

        const record = await GroupModel.findById(id);

        const group = record.toObject();

        return group.img[0];
    }


    public static async getFromId(Id: string): Promise<Group> {

        const id = mongoose.Types.ObjectId(Id);

        const record = await GroupModel.findById(id);

        return record;
    }




}