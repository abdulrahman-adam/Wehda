import express from "express";
import { upload } from "../configs/multer.js";
import { addProduct, changeStock, deleteProduct, productById, productList } from "../controllers/productController.js";
import authSeller from "../middleware/authSeller.js";


const productRouter = express.Router();

productRouter.post("/add", upload.array(["images"]), authSeller, addProduct);
productRouter.post("/add", authSeller, upload.array("images", 4), addProduct);
productRouter.get("/list", productList);
productRouter.get("/id", productById);
productRouter.post("/stock", authSeller, changeStock);
productRouter.delete("/delete", authSeller, deleteProduct); // ✅ new route
export default productRouter;