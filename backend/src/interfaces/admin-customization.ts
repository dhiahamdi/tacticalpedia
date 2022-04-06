import { TrainingCategory } from "./training/training-category";
import { TrainingSelectTaxonomy } from "./training/training-select-taxonomy";
import { TrainingTaxonomy } from "./training/training-taxonomy";

export interface AdminCustomization {
    custom_categories?: TrainingCategory[];
    custom_taxonomies?: TrainingTaxonomy[];
    custom_select_taxonomies?: TrainingSelectTaxonomy[];
}