import { TrainingCategory } from "app/interfaces/training-category";
import { TrainingFile } from "app/interfaces/training-file";
import { TrainingTaxonomy } from "app/interfaces/training-taxonomy";

export class Training {

    _id: string;

    user_id: string;

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

    taxonomies: TrainingTaxonomy & {value: string}[];
    selectTaxonomies: {name: string; value:string[]}[];
    image?: string[];

    files?: TrainingFile[];

    updatedAt?: any;

    tacticalpad_publishing_id?: string;


    constructor(training){

        this._id = training._id;
        this.goal = training.goal;
        this.strategy = training.strategy;
        this.focus = training.focus;
        this.description = training.description;
        this.variants = training.variants;
        this.name = training.name;
        this.category = training.category;
        this.type = training.type;
        this.contents = training.contents;
        this.goals = training.goals;
        this.players = training.players;
        this.space = training.space;
        this.time = training.time;
        this.repetitions = training.repetitions;
        this.recover = training.recover;
        this.intensity = training.intensity;
        this.visibility = training.visibility;
        this.observations = training.observations;
        this.developements = training.developements;
        this.notes = training.notes;
        this.taxonomies = training.taxonomies;
        this.image = training.image;
        this.selectTaxonomies = training.selectTaxonomies;
        this.user_id = training.user_id;

        this.updatedAt = training.updatedAt;
        this.files = training.files;
        this.tacticalpad_publishing_id = training.tacticalpad_publishing_id;

    }
}