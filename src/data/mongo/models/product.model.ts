import mongoose, { Schema } from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  available: {
    type: Boolean,
    default: false,
  },
  price: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    default: '',
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required'],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  }
});

productSchema.set('toJSON', {
  virtuals: true, //quita el _id y pone id
  versionKey: false, //quita el __v
  transform: function(doc, ret, options) {
    delete ret._id; //este quita el _id
  }
})

export const ProductModel = mongoose.model('Product', productSchema);