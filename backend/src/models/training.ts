import mongoose from 'mongoose'
import { Training } from '../interfaces/training/training';
import customizationSchema from './customization'
import trainingFileSchema from './training-file';

const Training = new mongoose.Schema(
    {

        user_id: {
            type: mongoose.Types.ObjectId,
        },
        goal: {
            type: String,
        },
        strategy: {
            type: String,
        },
        focus: {
            type: String,
        },

        description: {
            type: String,
        },
        variants: {
            type: String,
        },

        name: {
            type: String,
        },

        category: [customizationSchema],
        
        type: {
            type: String,
        },
        contents: {
            type: String,
        },
        goals: {
            type: String,
        },
        players: {
            type: String,
        },
        space: {
            type: String,
        },
        time: {
            type: String,
        },
        repetitions: {
            type: String,
        },
        recover: {
            type: String,
        },
        intensity: {
            type: String,
        },
        visibility: {
            type: String,
        },
        observations: {
            type: String,
        },

        developements: {
            type: String,
        },
        notes: {
            type: String,
        },
        image: [{
            type: String,
        }],

        draft: {
            type: Boolean,
        },

        taxonomies: [customizationSchema],

        files: [trainingFileSchema],

        selectTaxonomies: [new mongoose.Schema({ name: {type: String}, value: {type: [String]}})],

        tacticalpad_publishing_id: {
            type: String,
        },
    },
    { timestamps: true },
    );

const TrainingModel = mongoose.model<Training & mongoose.Document>('Training', Training);

export default TrainingModel;