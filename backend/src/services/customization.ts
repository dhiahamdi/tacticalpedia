import AdminDao from "../dao/AdminDao";
import UserDao from "../dao/UserDao";
import { TrainingCategory } from "../interfaces/training/training-category";
import { TrainingSelectTaxonomy } from "../interfaces/training/training-select-taxonomy";
import { TrainingTaxonomy } from "../interfaces/training/training-taxonomy";
import { User } from "../interfaces/user";

export default class CustomizationService {

    constructor() {}

    /* ADMIN FIELDS */

    public async syncAdminCategories(categories: TrainingCategory[]) {
        return await AdminDao.updateCategories(categories);
    }

    public async getAdminCategories() {
        return await AdminDao.getCategories();
    }

    public async syncAdminTaxonomies(taxonomies: TrainingTaxonomy[]) {
        return await AdminDao.updateTaxonomies(taxonomies);
    }

    public async getAdminTaxonomies() {
        return await AdminDao.getTaxonomies();
    }

    public async updateAdminSelectTaxonomies(selectTaxonomies: TrainingSelectTaxonomy[]) {
        return await AdminDao.updateSelectTaxonomies(selectTaxonomies);
    }

    public async getAdminSelectTaxonomies() {
        return await AdminDao.getSelectTaxonomies();
    }


    /* USER FIELDS */

    public async updateUserCategories(user: User, categories: TrainingCategory[]) {
        return await UserDao.updateUser(user, {'custom_categories': categories});
    }

    public async updateUserTaxonomies(user: User, taxonomies: TrainingTaxonomy[]) {
        return await UserDao.updateUser(user, {'custom_taxonomies': taxonomies});
    }

    public async updateUserSelectTaxonomies(user: User, selectTaxonomies: TrainingSelectTaxonomy[]) {
        return await UserDao.updateUser(user, {'custom_select_taxonomies': selectTaxonomies});
    }

}