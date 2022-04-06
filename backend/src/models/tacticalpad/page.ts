import mongoose from 'mongoose'
import { Page } from '../../interfaces/tacticalpad/page';
import trainingFileSchema from '../training-file';
import extraSchema from './extra';

var AutoIncrement = require('mongoose-sequence')(mongoose);

// Used to store custom categories and custom taxonomies
const pageSchema = new mongoose.Schema({

    publishing_id: {
      type: String,
    },

    internal_board_id:{
      type: String,
    },

    title: {
      type: String,
    },

    notes: {
        type: String,
    },

    filter_id: {
      type: [],
    },

    additional_info: [extraSchema],

    extra: [extraSchema],

    files: [trainingFileSchema],

  });


  const pageModel = mongoose.model<Page & mongoose.Document>('Page', pageSchema);

  export default pageModel;