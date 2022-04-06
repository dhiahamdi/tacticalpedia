import mongoose from 'mongoose'

// Used to store custom categories and custom taxonomies
const customizationSchema = new mongoose.Schema({
    slug: {
      type: String,
    },
    label: {
      type: String,
    },
    value: {
        type: String,
    }
  });

export default customizationSchema