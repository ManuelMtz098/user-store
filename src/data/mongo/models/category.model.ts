import mongoose, { Schema } from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    unique: true
  },
  available: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

categorySchema.set('toJSON', {
  virtuals: true, //quita el _id y pone id
  versionKey: false, //quita el __v
  transform: function(doc, ret, options) {
    delete ret._id; //este quita el _id
  }
})


export const CategoryModel = mongoose.model('Category', categorySchema);