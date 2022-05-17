import { User } from "./user";

export interface Group {

    _id : string;
    name : string;
    description : string;
    services : string[];
    topic : string[];
    discipline : string[];
    typology : string;
    privacy : string;
    price : string;
    img : string;
    updatedAt : string;

    authors : User[];
    subsciptions : string[];
    trainings : string[];


}
