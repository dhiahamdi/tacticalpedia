import { TrainingCategory } from "./training-category";

export interface TrainingDraft {

    _id?: string;
    name?: string;
    description?: string;
    category: TrainingCategory;
    visibility: string;
}