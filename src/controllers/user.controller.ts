import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.model.js";
import { NewUserRequestBody } from "../types/types.js";
import { TryCatch } from "../Middlewares/error.middleware.js";
import ErrorHandler from "../Utils/utility-class.js";

export const newUser = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, dob, _id, photo, gender } = req.body;

    let user = await User.findOne({ _id });
    if (user) {
      return res.status(201).json({
        success: true,
        message: `Welcome, ${user.name}`,
      });
    }
    if (!name || !photo || !email || !dob || !gender || !_id) {
     return next(new ErrorHandler("please add all fields", 400));
    }
    user = await User.create({
      name,
      email,
      dob: new Date(dob),
      _id,
      photo,
      gender,
    });

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
  }
);

export const getAllUsers = TryCatch(async (req, res, next) => {

  const users = await User.find({});

  return res.status(200).json({
    success: true,
    users,
  });
});


export const getUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById(id);
  
  if (!user) {
   return next(new ErrorHandler("Invalid ID", 400));
  }

  return res.status(200).json({
    success: true,
    user,
  });
});

export const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;

  const user = await User.findById(id);

  if (!user) {
    return next(new ErrorHandler("Invalid ID, User does not exist", 400));
  }

  await user?.deleteOne();
  return res.status(200).json({
    success: true,
    message:"User deleted successfully",
  });
});
