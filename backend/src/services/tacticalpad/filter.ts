import FilterDao from "../../dao/tacticalpad/FilterDao";
import { FilterMapping } from "../../interfaces/tacticalpad/filter-mapping";
import { TrainingCategory } from "../../interfaces/training/training-category";
import { TrainingSelectTaxonomy } from "../../interfaces/training/training-select-taxonomy";
import { User } from "../../interfaces/user";
import selectCustomizationSchema from "../../models/select-customization";
import CustomizationService from "../customization";

export default class FilterService {

    constructor() {}


    public async decodeEncodedCategory(int_id: number) {
        
        const filter = await FilterDao.getFilter(int_id);

        if (filter.type == 'category') {
            return {type: 'category', value: filter.value};

        } else if (filter.type == 'select-taxonomy') {
            return {type: 'select-taxonomy', select: filter.select, value: filter.value};
        }

    }

    /**
     * Gets all the categories as a FilterMapping objects, containing int id
     * to send to tacticalpad
     * 
     * @param user 
     * @returns 
     */
    public async getEncodedCategories(user?: User) {

        let categories;
        
        // Map admin and user categories to int ids
        const customizationService = new CustomizationService();

        const adminCategories = await customizationService.getAdminCategories();

        categories = await Promise.all( // Wrap everything in Promise.all to use map w/ async function
            adminCategories.map(async (category) => { 
                return this.getCategoryMapping(category);
            })
        );

        if (user && user.custom_categories) {
            const mappedUserCategories = await Promise.all(
                user.custom_categories.map(async (category) => {
                    return await this.getCategoryMapping(category, user);
                })
            );

            categories = categories.concat(mappedUserCategories); // merge admin and user mapped categories
        }

        return categories;
    }


    /**
     * Gets all the select taxonomies as a FilterMapping objects, containing int ids
     * to send to tacticalpad
     * 
     * @param user 
     * @returns 
     */
    public async getEncodedSelectTaxonomies(user?: User) {

        let taxonomies;
        
        const customizationService = new CustomizationService();

        const adminSelectTaxonomies = await customizationService.getAdminSelectTaxonomies();

        // Map admin select taxonomies to filter int ids
        taxonomies = await Promise.all(
            adminSelectTaxonomies.map(async (taxonomy) => { 
                return await this.getSelectTaxonomyMapping(taxonomy);
            })
        );

        if (user && user.custom_select_taxonomies) {
            const mappedUserTaxonomies = await Promise.all(
                user.custom_select_taxonomies.map(async (taxonomy) => {
                    return await this.getSelectTaxonomyMapping(taxonomy, user);
                })
            );

            taxonomies = taxonomies.concat(mappedUserTaxonomies); // merge admin and user mapped categories
        }

        return taxonomies;
    }


    /**
     * Binds a category to an int filter id
     * 
     * @param trainingCategory 
     * @param user 
     */
    public async getCategoryMapping(trainingCategory: TrainingCategory, user?: User) {

        const filterMapping : FilterMapping = {
            user_id: user ? user._id : null,
            type: 'category',
            value: trainingCategory.label
        };

        const filterRecord = await FilterDao.findOneOrCreate(filterMapping);

        return filterRecord;
    }


    /**
     * Stores a select taxonomy and binds it to an int filter id
     * 
     * @param trainingCategory 
     * @param user 
     */
     public async getSelectTaxonomyMapping(selectTaxonomy: TrainingSelectTaxonomy, user?: User) {

        let mappedSelect = {name: null, options: null};

        // Map the select name to an int_id (for tacticalpad purpose)
        const nameFilterMapping : FilterMapping = {
            user_id: user ? user._id : null,
            type: 'select-taxonomy',
            select: selectTaxonomy.name
        };

        const nameFilterRecord = await FilterDao.findOneOrCreate(nameFilterMapping);

        mappedSelect.name = nameFilterRecord;

        // Map options to int ids
        mappedSelect.options = await Promise.all(
            selectTaxonomy.options.map(async (option) => {

                const optionFilterMapping : FilterMapping = {
                    user_id: user ? user._id : null,
                    type: 'select-taxonomy',
                    select: selectTaxonomy.name,
                    value: option
                };

                const optionFilterRecord = await FilterDao.findOneOrCreate(optionFilterMapping);

                return optionFilterRecord;
            })
        );

        return mappedSelect;
    }

}