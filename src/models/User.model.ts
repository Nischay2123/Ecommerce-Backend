import mongoose from "mongoose";
import validator from "validator";

interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  photo: string;
  role: "user" | "admin";
  gender: "male" | "female";
  dob: Date;
  createdAt: Date;
  updatedAt: Date;
  // virtual attribute
  age: number;
}

const schema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: [true, "please enter ID"],
    },
    name: {
      type: String,
      require: [true, "please enter Name"],
    },
    email: {
      type: String,
      required: [true, "please enter Name"],
      unique: [true, "email aleardy exist"],
      validate: validator.default.isEmail,
    },
    photo: {
      type: String,
      required: [true, "please add Photo"],
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    gender: {
      type: String,
      required: [true, "please enter gender"],
      enum: ["male", "female"],
    },
    dob: {
      type: Date,
      required: [true, "please enter your date of birth"],
    },
  },
  {
    timestamps: true,
  }
);

schema.virtual("age").get(function () {
  const today = new Date();
  const dob = this.dob;
  let age = today.getFullYear() - dob.getFullYear();

  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDay() < dob.getDay())
  ) {
    age--;
  }
  return age
});

export const User = mongoose.model<IUser>("User", schema);

