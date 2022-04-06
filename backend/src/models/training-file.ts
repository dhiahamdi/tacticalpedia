import mongoose from 'mongoose'

// Used to store custom categories and custom taxonomies
const trainingFileSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    path: {
      type: String,
    }
  });

export default trainingFileSchema