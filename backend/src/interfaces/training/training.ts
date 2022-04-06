import { TrainingCategory } from "./training-category";
import { TrainingTaxonomy } from "./training-taxonomy";
import mongoose from 'mongoose';
import { TrainingFile } from "./training-file";

export interface Training {

    _id?: string;

    user_id: mongoose.Types.ObjectId;

    goal?: string;
    strategy?: string;
    focus?: string;

    description?: string;
    variants?: string;

    name?: string;

    category?: TrainingCategory[];
    
    type?: string;
    contents?: string;
    goals?: string;
    players?: string;
    space?: string;
    time?: string;
    repetitions?: string;
    recover?: string;
    intensity?: string;
    visibility?: string;
    observations?: string;

    developements?: string;
    notes?: string;

    taxonomies?: (TrainingTaxonomy & {value: string})[];

    selectTaxonomies?: {name: string; value:string[]}[];

    image?: string[];

    files?: TrainingFile[];

    draft?: boolean;

    updatedAt?: any;

    tacticalpad_publishing_id?: string;

}