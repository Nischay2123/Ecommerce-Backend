import express from "express";
import {
  allOrder,
  deleteOrder,
  getSingleOrder,
  myOrder,
  newOrder,
  processOrder,
} from "../controllers/order.controller.js";
import { adminOnly } from "../Middlewares/auth.middlerware.js";

const app = express();

// route - /api/v1/order/new
app.post("/new", newOrder);

// route - /api/v1/order/myorder
app.get("/myorder", myOrder);

// route - /api/v1/order/all
app.get("/all", adminOnly, allOrder);

app
  .route("/:id")
  .get(getSingleOrder)
  .put(adminOnly, processOrder)
  .delete(adminOnly, deleteOrder);

export default app;
