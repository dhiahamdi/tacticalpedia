import mongoose from 'mongoose';

import { FilterMapping } from '../../interfaces/tacticalpad/filter-mapping';

var AutoIncrement = require('mongoose-sequence')(mongoose);

// Used map between tacticalpedia categories and taxonomies to tacticalpad filters
const filterMappingSchema = new mongoose.Schema({

    user_id: {
        type: String
    },

    type: {
        type: String // category or taxonomy
    },

    select: {
        type: String
    },

    value: {
        type: String // value of filter, if null means this filter is just the name of the cat/tax
    }

  });

  filterMappingSchema.plugin(AutoIncrement, {id:'filter', inc_field: 'int_id', start_seq: 2});

  const filterMappingModel = mongoose.model<FilterMapping & mongoose.Document>('Filter', filterMappingSchema);

  export default filterMappingModel;