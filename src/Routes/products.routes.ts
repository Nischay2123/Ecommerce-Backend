import express from "express";
import { adminOnly } from "../Middlewares/auth.middlerware.js";
import { singleUpload } from "../Middlewares/multer.middlerware.js";
import {
  deleteProduct,
  getAdminProducts,
  getAllProducts,
  getCategories,
  getLatestProducts,
  getSingleProduct,
  newProduct,
  updateProduct,
} from "../controllers/product.controller.js";
const app = express();

// to create new products -- /api/v1/product/new
app.post("/new", adminOnly, singleUpload, newProduct);

// to get all products with filters -- /api/v1/product/all
app.get("/all", getAllProducts);

// to get latest 5 products -- /api/v1/product/latest
app.get("/latest", getLatestProducts);

// to get category list -- /api/v1/product/categories
app.get("/categories", getCategories);

// to get all products  -- /api/v1/product/admin-products
app.get("/admin-products",adminOnly, getAdminProducts);

app
  .route("/:id")
  .get(getSingleProduct)
  .put(adminOnly,singleUpload,updateProduct)
  .delete(adminOnly,deleteProduct);

export default app;
