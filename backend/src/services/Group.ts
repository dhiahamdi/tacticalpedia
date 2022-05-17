import GroupDao from "../dao/GroupDao";
import UserDao from "../dao/UserDao";
import TrainingDao from "../dao/TrainingDao";
import { Group } from "../interfaces/groups/Group";
import { User } from "../interfaces/user";
import FileManagerService from "./file-manager";
import { Training } from "../interfaces/training/training";

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

      if (!GroupRecord) throw new Error("Unable to create Group");

      return GroupRecord;
    } catch (e) {
      throw e;
    }
  }



  async editGroup(GroupId: string, group: Group): Promise<string> {
    try {
      const GroupRecord = await GroupDao.edit(GroupId, group);

      if (!GroupRecord) throw new Error("Unable to edit Group");

      return GroupRecord.toObject()._id.toString();
    } catch (e) {
      throw e;
    }
  }

  async deleteGroups(GroupId: string): Promise<void> {
    try {
      let GroupRecord = await GroupDao.getFromId(GroupId);
      await GroupDao.deleteById(GroupId);
    } catch (e) {
      throw e;
    }
  }

  async addGroupAuthor(groupId: string, userId: string): Promise<string> {
    try {
      const user = await UserDao.getUserById(userId);
      const group = await GroupDao.getFromId(groupId);

      if (!user) throw new Error("Unable to find user");
      if (!group) throw new Error("Unable to find group");

      if (!group.authors.find((el) => el == userId))
        group.authors = [...group.authors, userId];

      const GroupRecord = await GroupDao.edit(groupId, group);

      if (!GroupRecord) throw new Error("Unable to edit Group");

      return GroupRecord.toObject()._id.toString();
    } catch (e) {
      throw e;
    }
  }

  async addGroupAuthorByEmail(groupId: string, userId: string): Promise<string> {
    try {
      const user = await UserDao.getUserByEmail(userId);
      const group = await GroupDao.getFromId(groupId);

      if (!user) throw new Error("Unable to find user");
      if (!group) throw new Error("Unable to find group");

      if (!group.authors.find((el) => el == user._id))
        group.authors = [...group.authors, user._id];

      const GroupRecord = await GroupDao.edit(groupId, group);

      if (!GroupRecord) throw new Error("Unable to edit Group");

      return GroupRecord.toObject()._id.toString();
    } catch (e) {
      throw e;
    }
  }

  async removeGroupAuthor(groupId: string, Id: string): Promise<string> {
    try {
      const user = await UserDao.getUserById(Id);
      const group = await GroupDao.getFromId(groupId);

      if (!user) throw new Error("Unable to find user in this group");
      if (!group) throw new Error("Unable to find group");

      if (group.authors.length > 1)
        group.authors = group.authors.filter(el => el != Id);
      else
        if (!group) throw new Error("only one rmaining , you cannot del this author !");

      const GroupRecord = await GroupDao.edit(groupId, group);

      if (!GroupRecord) throw new Error("Unable to update Group");

      return GroupRecord.toObject()._id.toString();
    } catch (e) {
      throw e;
    }
  }

  async addGroupTraining(groupId: string, trainingId: string): Promise<string> {
    try {
      const training = await TrainingDao.getFromId(trainingId);
      const group = await GroupDao.getFromId(groupId);

      if (!training) throw new Error("Unable to find training");
      if (!group) throw new Error("Unable to find group");

      if (!group.trainings.find((el) => el == trainingId))
        group.trainings = [...group.trainings, trainingId];

      if (!training.groups.find((el) => el == groupId))
        training.groups = [...training.groups, groupId];

      const GroupRecord = await GroupDao.edit(groupId, group);
      const TrainingRecord = await TrainingDao.editTraining(trainingId, training);

      if (!GroupRecord) throw new Error("Unable to edit Group");
      if (!TrainingRecord) throw new Error("Unable to edit Training");

      return GroupRecord.toObject()._id.toString();
    } catch (e) {
      throw e;
    }
  }


  async removeGroupTraining(groupId: string, trainingId: string): Promise<string> {
    try {
      const training = await TrainingDao.getFromId(trainingId);
      const group = await GroupDao.getFromId(groupId);

      if (!training) throw new Error("Unable to find training");
      if (!group) throw new Error("Unable to find group");


      group.trainings = group.trainings.filter(el => el != trainingId);
      training.groups = training.groups.filter(el => el != groupId);

      const GroupRecord = await GroupDao.edit(groupId, group);
      const TrainingRecord = await TrainingDao.editTraining(trainingId, training);

      if (!GroupRecord) throw new Error("Unable to update Group");
      if (!TrainingRecord) throw new Error("Unable to update Training");

      return GroupRecord.toObject()._id.toString();
    } catch (e) {
      throw e;
    }
  }

  async addGroupSubscription(groupId: string, userId: string): Promise<string> {
    try {
      const user = await UserDao.getUserByEmail(userId);
      const group = await GroupDao.getFromId(groupId);

      if (!user) throw new Error("Unable to find user");
      if (!group) throw new Error("Unable to find group");

      if (!group.subsciptions.find((el) => el == user._id))
        group.subsciptions = [...group.subsciptions, user._id];

      const GroupRecord = await GroupDao.edit(groupId, group);

      if (!GroupRecord) throw new Error("Unable to subscribe to group");

      return GroupRecord.toObject()._id.toString();
    } catch (e) {
      throw e;
    }
  }

  async removeGroupSubscription(groupId: string, Id: string): Promise<string> {
    try {
      const user = await UserDao.getUserById(Id);
      const group = await GroupDao.getFromId(groupId);

      if (!user) throw new Error("Unable to find user in this group");
      if (!group) throw new Error("Unable to find group");

      group.subsciptions = group.subsciptions.filter(el => el != Id);

      const GroupRecord = await GroupDao.edit(groupId, group);

      if (!GroupRecord) throw new Error("Unable to update Group");

      return GroupRecord.toObject()._id.toString();
    } catch (e) {
      throw e;
    }
  }

  async addImagesToGroup(GroupId: string, filePaths: string): Promise<void> {
    try {
      let GroupRecord = await GroupDao.getFromId(GroupId);

      // await FileManagerService.removeFiles([GroupRecord.img]);

      GroupRecord = await GroupDao.addImages(GroupId, filePaths);

      if (!GroupRecord) throw new Error("Unable to add image to Group");

      return;
    } catch (e) {
      throw e;
    }
  }

  async deleteImagesFromGroup(GroupId: string): Promise<void> {
    try {
      //fetch images path before removing them from db
      let GroupRecord = await GroupDao.getFromId(GroupId);

      const result = await GroupDao.removeImages(GroupId);

      if (!result) throw new Error("Unable to delete images from Group");

      //delete images from server
      await FileManagerService.removeFiles([GroupRecord.img]);

      return;
    } catch (e) {
      throw e;
    }
  }

  async getGroups(filters): Promise<Group[]> {
    try {
      let GroupsList = await GroupDao.getAll();

      if (!GroupsList) throw new Error("Unable to fetch Groups");
      GroupsList = GroupsList.filter((group) => {
        const service_check: boolean = filters.service
          ? group.services.find(
            (el) => el.toLowerCase() == filters.service.toLowerCase()
          ) != undefined
          : true;
        const topic_check: boolean = filters.topic
          ? group.topic.find(
            (el) => el.toLowerCase() == filters.topic.toLowerCase()
          ) != undefined
          : true;
        const discpline_check: boolean = filters.discipline
          ? group.discipline.find(
            (el) => el.toLowerCase() == filters.discipline.toLowerCase()
          ) != undefined
          : true;
        const authors_check: boolean = filters.authors
          ? group.authors.find(
            (el) => el.toLowerCase() == filters.topic.toLowerCase()
          ) != undefined
          : true;

        return service_check && topic_check && discpline_check && authors_check;
      });
      return GroupsList;
    } catch (e) {
      throw e;
    }
  }

  async getUserGroups(userId: string, filters): Promise<Group[]> {
    try {
      let GroupsList = await GroupDao.getUserGroup(userId)
      if (!GroupsList) return [];
      GroupsList = GroupsList.filter((group) => {
        const service_check: boolean = filters.service
          ? group.services.find(
            (el) => el.toLowerCase() == filters.service.toLowerCase()
          ) != undefined
          : true;
        const topic_check: boolean = filters.topic
          ? group.topic.find(
            (el) => el.toLowerCase() == filters.topic.toLowerCase()
          ) != undefined
          : true;
        const discpline_check: boolean = filters.discipline
          ? group.discipline.find(
            (el) => el.toLowerCase() == filters.discipline.toLowerCase()
          ) != undefined
          : true;
        const authors_check: boolean = filters.authors
          ? group.authors.find(
            (el) => el.toLowerCase() == filters.topic.toLowerCase()
          ) != undefined
          : true;

        return service_check && topic_check && discpline_check && authors_check;
      });
      return GroupsList;
    } catch (e) {
      throw e;
    }
  }

  async getUserGroupsSubs(userId: string, filters): Promise<Group[]> {
    try {
      let GroupsList = await GroupDao.getUserGroupSubs(userId)
      if (!GroupsList) return [];
      GroupsList = GroupsList.filter((group) => {
        const service_check: boolean = filters.service
          ? group.services.find(
            (el) => el.toLowerCase() == filters.service.toLowerCase()
          ) != undefined
          : true;
        const topic_check: boolean = filters.topic
          ? group.topic.find(
            (el) => el.toLowerCase() == filters.topic.toLowerCase()
          ) != undefined
          : true;
        const discpline_check: boolean = filters.discipline
          ? group.discipline.find(
            (el) => el.toLowerCase() == filters.discipline.toLowerCase()
          ) != undefined
          : true;
        const authors_check: boolean = filters.authors
          ? group.authors.find(
            (el) => el.toLowerCase() == filters.topic.toLowerCase()
          ) != undefined
          : true;

        return service_check && topic_check && discpline_check && authors_check;
      });
      return GroupsList;
    } catch (e) {
      throw e;
    }
  }

  async getImgPath(GroupId: string): Promise<string> {
    try {
      const GroupImgPath = await GroupDao.getImgPath(GroupId);

      if (!GroupImgPath) throw new Error("Unable to get img path");

      return GroupImgPath;
    } catch (e) {
      throw e;
    }
  }

  async getGroupFromId(GroupId: string): Promise<Group> {
    try {
      const Group = await GroupDao.getFromId(GroupId);

      if (!Group) throw new Error("Unable to find Group");

      return Group;
    } catch (e) {
      throw e;
    }
  }


  async getGroupTrainings(groupId: string): Promise<Training[]> {
    try {
      const group = await GroupDao.getFromId(groupId);

      if (!group) throw new Error("Unable to find group");

      if (!group.trainings)
        return [];

      if (!group.trainings.length)
        return [];

      const trainings = await TrainingDao.getTrainingsbyids(group.trainings)

      return trainings;

    } catch (e) {
      throw e;
    }
  }

}