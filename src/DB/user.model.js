import { Schema, model, Types } from "mongoose";
import { hash } from "../utils/bcrypt.js";
import { type } from "os";
import { ref } from "process";

export const Roles = {
  user: "user",
  admin: "admin",
};
export const Genders = {
  male: "male",
  female: "female",
};
export const providers = {
  google: "google",
  system: "system",
};
Object.freeze(Roles);
Object.freeze(Genders);
Object.freeze(providers);
export const schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      max: 30,
      min: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.provider == providers.system ? true : false;
      },
      min: 4,
      max: 30,
      set(value) {
        return hash(value);
      },
    },
    role: {
      type: String,
      default: Roles.user,
      enum: Object.values(Roles),
    },
    gender: {
      type: String,
      default: Genders.male,
      enum: Object.values(Genders),
    },
    phone: {
      type: String,
      required: function () {
        return this.provider == providers.system ? true : false;
      },
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    emailOtp: {
      otp: String,
      expiredIn: Date,
    },
    passwordOtp: {
      otp: String,
      expiredIn: Date,
    },
    newEmail: {
      type: String,
    },
    newEmailOtp: {
      otp: String,
      expiredIn: Date,
    },

    credentialChangeAt: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    deletedBy: {
      type: Types.ObjectId,
      ref: "user",
    },
    oldPasswords:[{
      type:String
    }
    ],
    profileImage:{
         type:String
    },
    failedAttempts:{
          type:Number
    },
    banTime:{
      type:Date
    },
    banStatus:{
      type:Boolean,
      default:false
    },
    provider: {
      type: String,
      enum: Object.values(providers),
      default: providers.system,
    },
  },
  { timestamp: true }
);

export const UserModel = model("user", schema);
