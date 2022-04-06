import { TrainingFile } from "../training/training-file";

export interface Publishing {
    
    int_id: number;
    _id: string;
    title: string;
    source_project: {
        project_id: number;
        modified_at: string;
        size: number;
    };
    extra: {
        key: string;
        value: string;
    }[];
    
    files: TrainingFile[];

    
}