import mongoose from 'mongoose'
import { Group } from '../interfaces/groups/Group';
import User from './user';
import Training from './training';

const Group = new mongoose.Schema(
    {
        name: {
            type: String,
        },

        description: {
            type: String,
        },
        services: {
            type: String,
        },
        typology: {
            type: String,
        },
        privacy: {
            type: String,
        },
        price: {
            type: String,
        },
        img: {
            type: String,
        },
        
        
        authors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        subsciptions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'subsciptions' }],
        trainings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Training' }],
    
    },
    { timestamps: true },
    );

const GroupModel = mongoose.model<Group & mongoose.Document>('Group', Group);

export default GroupModel;