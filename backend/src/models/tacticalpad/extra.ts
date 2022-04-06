import mongoose from 'mongoose'

// Used to store custom categories and custom taxonomies
const extraSchema = new mongoose.Schema({
    key: {
      type: String,
    },
    value: {
      type: String,
    }
  });

export default extraSchema;