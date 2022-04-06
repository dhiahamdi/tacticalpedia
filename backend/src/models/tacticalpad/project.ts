import mongoose from 'mongoose'
import { Project } from '../../interfaces/tacticalpad/project';
import { Publishing } from '../../interfaces/tacticalpad/publishing';
import extraSchema from './extra';

var AutoIncrement = require('mongoose-sequence')(mongoose);

// Used to store custom categories and custom taxonomies
const projectSchema = new mongoose.Schema({

    user_id: {
      type: String,
    },

    int_id: {
      type: Number,
    },

    filter_id: {
      type: [],
    },

    attached_file_info: {

      modified_at: {
        type: String
      },

      mimetype: {
        type: String, 
      },

      size: {
        type: Number
      },

      metadata: {
        type: String
      },

      filename: {
        type: String
      },

    },

    fullPath: {
        type: String
    },

    share_info: {

        type: {
            type: Number
        },

        access_info: {

            id: {
                type: Number
            },

            permission: {
                type: Number
            }
        }
    },

    extra: [extraSchema],

    tacticalpedia_file_path: {
        type: String
    }

  });

  projectSchema.plugin(AutoIncrement, {id:'project',inc_field: 'int_id'});

  const projectModel = mongoose.model<Project & mongoose.Document>('Project', projectSchema);

  export default projectModel;