import { Router } from "express";
import {
  createProject,
  getTrashDeleteTaskProject,
  getUserProjects,
  permanentlyDeleteTaskOrProject,
  recoverTaskOrProject,
  searchTaskProject,
  softDeleteProject,
  updateProject,
} from "../controller/project.controller";
import { isAuthenticated } from "../middlewares/authUser";

const router = Router();

router.post("/create-project", isAuthenticated, createProject);
router.get("/get-user-project", isAuthenticated, getUserProjects);
router.put("/update-project/:projectId", isAuthenticated, updateProject);
router.delete("/soft-delete-project/:projectId", isAuthenticated, softDeleteProject);

router.get("/trash-delete-task-project", isAuthenticated, getTrashDeleteTaskProject);
router.get("/search", isAuthenticated, searchTaskProject);

router.post("/recover-task-or-project/:id", isAuthenticated, recoverTaskOrProject);
router.delete("/permanently-delete-task-or-project/:id", isAuthenticated, permanentlyDeleteTaskOrProject);

export default router;
