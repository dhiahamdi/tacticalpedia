import GroupDao from "../dao/GroupDao";
import UserDao from "../dao/UserDao";
import TrainingDao from "../dao/TrainingDao";
import { Group } from "../interfaces/groups/Group";
import { User } from "../interfaces/user";
import FileManagerService from "./file-manager";


export default class GroupService {


    constructor() { }

    /**
     * Insert a new Group
     * 
     * @param Group: Group
     * @return
     */
    async insertGroup(group: Group): Promise<Group> {

        try {
            const GroupRecord = await GroupDao.create(group);

            if (!GroupRecord) throw new Error('Unable to create Group');

            return GroupRecord;

        } catch (e) {
            throw (e);
        }

    }


    async editGroup(GroupId: string, group: Group): Promise<string> {

        try {

            const GroupRecord = await GroupDao.edit(GroupId, group);

            if (!GroupRecord) throw new Error('Unable to edit Group');

            return GroupRecord.toObject()._id.toString()


        } catch (e) {
            throw (e);
        }
    }

    async deleteGroups(GroupId: string): Promise<void> {

        try {
            let GroupRecord = await GroupDao.getFromId(GroupId);
            await GroupDao.deleteById(GroupId);

        } catch (e) {

            throw (e);
        }
    }

    async addGroupAuthor(groupId: string, userId: string): Promise<string> {

        try {

            const user = await UserDao.getUserById(userId);
            const group = await GroupDao.getFromId(groupId);

            if (!user) throw new Error('Unable to find user');
            if (!group) throw new Error('Unable to find group');

            if (!group.authors.find(el => el == userId))
                group.authors = [...group.authors, userId];


            const GroupRecord = await GroupDao.edit(groupId, group);

            if (!GroupRecord) throw new Error('Unable to edit Group');

            return GroupRecord.toObject()._id.toString()


        } catch (e) {
            throw (e);
        }
    }


    async addGroupTraining(groupId: string, trainingId: string): Promise<string> {

        try {

            const training = await TrainingDao.getFromId(trainingId);
            const group = await GroupDao.getFromId(groupId);

            if (!training) throw new Error('Unable to find training');
            if (!group) throw new Error('Unable to find group');

            if (!group.trainings.find(el => el == trainingId))
            group.trainings = [...group.trainings, trainingId];


            const GroupRecord = await GroupDao.edit(groupId, group);

            if (!GroupRecord) throw new Error('Unable to edit Group');

            return GroupRecord.toObject()._id.toString()


        } catch (e) {
            throw (e);
        }
    }

    async addGroupSubscription(groupId: string, userId: string): Promise<string> {

        try {

            const user = await UserDao.getUserById(userId);
            const group = await GroupDao.getFromId(groupId);

            if (!user) throw new Error('Unable to find user');
            if (!group) throw new Error('Unable to find group');

            if (!group.subsciptions.find(el => el == userId))
            group.subsciptions = [...group.subsciptions, userId];


            const GroupRecord = await GroupDao.edit(groupId, group);

            if (!GroupRecord) throw new Error('Unable to subscribe to group');

            return GroupRecord.toObject()._id.toString()


        } catch (e) {
            throw (e);
        }
    }

    async addImagesToGroup(GroupId: string, filePaths: string): Promise<void> {

        try {

            let GroupRecord = await GroupDao.getFromId(GroupId);

           // await FileManagerService.removeFiles([GroupRecord.img]);

            GroupRecord = await GroupDao.addImages(GroupId, filePaths);

            if (!GroupRecord) throw new Error('Unable to add image to Group');

            return;


        } catch (e) {

            throw (e);
        }
    }

    async deleteImagesFromGroup(GroupId: string): Promise<void> {

        try {
            //fetch images path before removing them from db
            let GroupRecord = await GroupDao.getFromId(GroupId);

            const result = await GroupDao.removeImages(GroupId);

            if (!result) throw new Error('Unable to delete images from Group');

            //delete images from server
            await FileManagerService.removeFiles([GroupRecord.img]);

            return;


        } catch (e) {
            throw (e);
        }
    }

    async getGroups(): Promise<Group[]> {

        try {

            let GroupsList = await GroupDao.getAll();

            if (!GroupsList) throw new Error('Unable to fetch Groups');

            return GroupsList;

        } catch (e) {

            throw (e);
        }
    }


    async getImgPath(GroupId: string): Promise<string> {

        try {

            const GroupImgPath = await GroupDao.getImgPath(GroupId);

            if (!GroupImgPath) throw new Error('Unable to get img path');

            return GroupImgPath;


        } catch (e) {

            throw (e);
        }
    }

    async getGroupFromId(GroupId: string): Promise<Group> {

        try {

            const Group = await GroupDao.getFromId(GroupId);

            if (!Group) throw new Error('Unable to find Group');

            return Group;

        } catch (e) {

            throw (e);
        }
    }


}