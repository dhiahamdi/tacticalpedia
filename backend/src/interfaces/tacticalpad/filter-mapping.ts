export interface FilterMapping {
    int_id?: number;
    user_id?: string; //if null belongs to admin
    type: string;
    select?: string;
    value?: string;
}