import { FilterMapping } from "../../interfaces/tacticalpad/filter-mapping";
import filterMappingModel from "../../models/tacticalpad/filter-mapping";


export default class FilterDao {

    constructor(){}

    public static async findOneOrCreate(filterMapping: FilterMapping): Promise<FilterMapping>  {

        const filterRecord = await filterMappingModel.findOne(filterMapping);

        if (!filterRecord) return await filterMappingModel.create(filterMapping); 

        return filterRecord;
    }

    public static async create(page: FilterMapping): Promise<FilterMapping> {      
        return await filterMappingModel.create(page);
    }

    public static async getFilter(int_id: number): Promise<FilterMapping> {
        return await filterMappingModel.findOne({int_id: int_id});
    }

}
