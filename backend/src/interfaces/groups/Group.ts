import mongoose from 'mongoose';
import {User} from '../user';
import {Training} from '../training/training';

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

    authors : string[];
    subsciptions : string[];
    trainings : string[];


}