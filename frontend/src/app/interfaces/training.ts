import { TrainingCategory } from "./training-category";
import { TrainingFile } from "./training-file";
import { TrainingSelectTaxonomy } from "./training-select-taxonomy";
import { TrainingTaxonomy } from "./training-taxonomy";

export interface Training {

    _id: string;

    user_id?: string;
    
    goal: string;
    strategy: string;
    focus: string;

    description: string;
    variants: string;

    name: string;

    category: TrainingCategory[];
    
    type: string;
    contents: string;
    goals: string;
    players: string;
    space: string;
    time: string;
    repetitions: string;
    recover: string;
    intensity: string;
    visibility: string;
    observations: string;

    developements: string;
    notes: string;

    taxonomies: (TrainingTaxonomy & {value: string})[];

    selectTaxonomies: {name: string; value:string[]}[];
    
    image?: string[];

    files?: TrainingFile[];

    updatedAt?: any;

    tacticalpad_publishing_id?: string;

}