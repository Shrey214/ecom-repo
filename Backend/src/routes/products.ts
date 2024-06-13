import express from "express";
import { adminOnly } from "../middlewares/auth.js";
import {
  deleteProduct,
  getAdminProducts,
  getAllCategories,
  getAllFilteredProducts,
  getLatestProducts,
  getSingleProduct,
  newProduct,
  updateProductById,
} from "../controllers/product.js";
import { singleUpload } from "../middlewares/multer.js";
const app = express.Router();

app.post("/new", adminOnly, singleUpload, newProduct);
app.get("/latest", getLatestProducts);
app.get("/categories", getAllCategories);
app.get("/admin-products", getAdminProducts);
app.get("/all",getAllFilteredProducts);
app
  .route("/:id")
  .get(getSingleProduct)
  .put(singleUpload, updateProductById)
  .delete(deleteProduct);
export default app;
