import { Router } from "express";
import { isAuthenticated } from "../middlewares/authUser";
import {
  createTask,
  deleteTask,
  getUserTasks,
  updateTask,
} from "../controller/task.controller";

const router = Router();

router.post("/create-task/:projectId", isAuthenticated, createTask);
router.get("/get-task", isAuthenticated, getUserTasks);
router.put("/update-task/:taskId", isAuthenticated, updateTask);
router.delete("/delete-task/:taskId", isAuthenticated, deleteTask);

export default router;
