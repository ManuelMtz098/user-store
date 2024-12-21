import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  emailValidated: {
    type: Boolean,
    default: false,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  img: {
    type: String,
  },
  role: {
    type: [String],
    default: "USER_ROLE",
    enum: ["USER_ROLE", "ADMIN_ROLE"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.set('toJSON', {
  virtuals: true, //quita el _id y pone id
  versionKey: false, //quita el __v
  transform: function(doc, ret, options) {
    delete ret._id; //este quita el _id
    delete ret.password;
  }
})


export const UserModel = mongoose.model('User', userSchema);