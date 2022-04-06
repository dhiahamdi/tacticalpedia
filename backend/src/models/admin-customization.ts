import mongoose from 'mongoose'
import { AdminCustomization } from '../interfaces/admin-customization';
import customizationSchema from './customization';
import selectCustomizationSchema from './select-customization';

// Used to store custom categories and custom taxonomies
const AdminCustomizationSchema = new mongoose.Schema({
    custom_categories: [customizationSchema],
    custom_taxonomies: [customizationSchema],
    custom_select_taxonomies: [selectCustomizationSchema]
  }
  );


  const AdminCustomizationModel = mongoose.model<AdminCustomization & mongoose.Document>('AdminCustomization', AdminCustomizationSchema);
  
  export default AdminCustomizationModel;