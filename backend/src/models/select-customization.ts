import mongoose from 'mongoose'

// Used to store custom select taxonomies
// It differs from categories and text taxonomies
const selectCustomizationSchema = new mongoose.Schema({
    name: {
      type: String,
    },
    options: {
      type: [String],
    }

  });

export default selectCustomizationSchema