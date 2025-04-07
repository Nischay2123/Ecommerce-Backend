import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUser,
  newUser,
} from "../controllers/user.controller.js";
import { adminOnly } from "../Middlewares/auth.middlerware.js";
const app = express();

// route /api/v1/user/new
app.post("/new", newUser);

// route /api/v1/user/all
app.get("/all", adminOnly, getAllUsers);

// route /api/v1/user/dynamicID
app.route("/:id").get(getUser).delete(adminOnly, deleteUser);

export default app;
