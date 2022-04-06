import { Training } from "../interfaces/training/training";
import mongoose from 'mongoose';
import { User } from "../interfaces/user";
import { TrainingCategory } from "../interfaces/training/training-category";
import AdminCustomizationModel from "../models/admin-customization";
import { AdminCustomization } from "../interfaces/admin-customization";
import { TrainingTaxonomy } from "../interfaces/training/training-taxonomy";
import { TrainingSelectTaxonomy } from "../interfaces/training/training-select-taxonomy";

export default class AdminDao {

    constructor(){}

    protected static async getConfiguration(): Promise<AdminCustomization> {
        let configuration = await AdminCustomizationModel.findOne({});

        if (!configuration) {
            await AdminCustomizationModel.create({});
            configuration = await AdminCustomizationModel.findOne({});
        }

        return configuration;
    }

    public static async getCategories(){
        const configuration = await this.getConfiguration();
        return configuration.custom_categories;
    }

    public static async updateCategories(categories: TrainingCategory[]){
        return await AdminCustomizationModel.findOneAndUpdate({}, { $set: { custom_categories: categories }}, { upsert: true  })
    }

    public static async getTaxonomies(){
        const configuration = await this.getConfiguration();
        return configuration.custom_taxonomies;
    }

    public static async updateTaxonomies(taxonomies: TrainingTaxonomy[]){
        return await AdminCustomizationModel.findOneAndUpdate({}, { $set: { custom_taxonomies: taxonomies }}, { upsert: true  })
    }

    public static async getSelectTaxonomies(){
        const configuration = await this.getConfiguration();
        return configuration.custom_select_taxonomies;
    }

    public static async updateSelectTaxonomies(taxonomies: TrainingSelectTaxonomy[]){
        return await AdminCustomizationModel.findOneAndUpdate({}, { $set: { custom_select_taxonomies: taxonomies }}, { upsert: true  })
    }

}