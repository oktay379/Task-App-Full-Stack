import express from "express";
import { createTask, getUserTodos, updateTask, toggleTaskComplete, deleteTask, getTodo, getTasksByTag } from "../controllers/todos.js";
import { verifyUser } from "../controllers/auth.js";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "Public/Images");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


router.post("/create", verifyUser, upload.single('file'), createTask);
router.get("/tags/:tag", verifyUser, getTasksByTag);
router.get("/user-todos", verifyUser, getUserTodos);
router.get("/user-todo/:id", verifyUser, getTodo);
router.put("/update-todo/:id", verifyUser, upload.single('file'), updateTask);
router.put("/toggle-complete/:id", verifyUser, toggleTaskComplete);
router.delete("/delete-todo/:id", verifyUser, deleteTask);


export default router;
