import { TrainingFile } from "../training/training-file";

export interface Page {

    _id?: string;
    
    publishing_id: string;

    internal_board_id: string;

    title: string;
    notes: string;
    filter_id: any;
    additional_info: {
        key: string;
        value: string;
    }[];

    extra: {
        key: string;
        value: string;
    }[];

    files: TrainingFile[];

}
