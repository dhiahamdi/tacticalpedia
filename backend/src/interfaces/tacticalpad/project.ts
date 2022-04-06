export interface Project {

    user_id: string;
    int_id: number;
    _id: string;
    filter_id: any;
    attached_file_info: {
        modified_at: string;
        mimetype: string;
        size: number;
        metadata: string;
        filename: string;
    };
    fullPath: string;
    share_info?: {
        type: number;
        access_info: {
            id: number;
            permission: number;
        };
    }
    extra?: {
        key: string;
        value: string;
    }[];
    tacticalpedia_file_path: string;
}