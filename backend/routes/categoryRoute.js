import express from "express";
import { upload } from "../configs/multer.js";
import authSeller from "../middleware/authSeller.js";
import { addCategory, categoryList, deleteCategory } from "../controllers/categoryController.js";


const categoryRouter = express.Router();

categoryRouter.post("/add", upload.single("image"),authSeller, addCategory);
categoryRouter.get("/list", categoryList);
categoryRouter.post("/delete", authSeller, deleteCategory); // ✅ new route


export default categoryRouter;