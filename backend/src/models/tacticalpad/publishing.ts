import mongoose from 'mongoose'
import { Publishing } from '../../interfaces/tacticalpad/publishing';
import trainingFileSchema from '../training-file';
import extraSchema from './extra';
import pageSchema from './page';

var AutoIncrement = require('mongoose-sequence')(mongoose);

// Used to store custom categories and custom taxonomies
const publishingSchema = new mongoose.Schema({

    int_id: {
      type: Number,
    },

    title: {
      type: String,
    },
    source_project: {

      project_id: {
        type: Number
      },

      modified_at: {
        type: String, // TO TEST timestamp
      },

      size: {
        type: Number
      },

    },
    extra: [extraSchema],

    files: [trainingFileSchema]
    
  });

  publishingSchema.plugin(AutoIncrement, {id:'publishing',inc_field: 'int_id'});

  const publishingModel = mongoose.model<Publishing & mongoose.Document>('Publishing', publishingSchema);

  export default publishingModel;