import { Router } from "express";
import { isAuthenticated } from "../middlewares/authUser";
import {
  createTask,
  deleteTask,
  getAllUserTasks,
  getTasksByProjectId,
  softDeleteTask,
  updateTask,
} from "../controller/task.controller";

const router = Router();

router.post("/create-task/:projectId", isAuthenticated, createTask);
router.get("/get-all-task", isAuthenticated, getAllUserTasks);
router.get("/project/:projectId/tasks", isAuthenticated, getTasksByProjectId);
router.put("/update-task/:taskId", isAuthenticated, updateTask);
router.delete("/delete-task/:taskId", isAuthenticated, deleteTask);

router.delete("/soft-delete-task/:taskId", isAuthenticated, softDeleteTask);

export default router;
