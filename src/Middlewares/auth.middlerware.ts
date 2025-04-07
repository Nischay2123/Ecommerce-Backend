import { User } from "../models/User.model.js";
import ErrorHandler from "../Utils/utility-class.js";
import { TryCatch } from "./error.middleware.js";


// Middleware to make sure only admin is allowed
export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;

  if (!id) return next(new ErrorHandler("Not LoggedIn", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Admin not exist", 401));
  if (user.role !== "admin")
    return next(new ErrorHandler("Unauthorized Request", 403));

  next();
});