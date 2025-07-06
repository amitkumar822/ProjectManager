import { Router } from "express";
import {
  createProject,
  deleteProject,
  getUserProjects,
  searchTaskProject,
  softDeleteProject,
  updateProject,
} from "../controller/project.controller";
import { isAuthenticated } from "../middlewares/authUser";

const router = Router();

router.post("/create-project", isAuthenticated, createProject);
router.get("/get-user-project", isAuthenticated, getUserProjects);
router.put("/update-project/:projectId", isAuthenticated, updateProject);
router.delete("/delete-project/:projectId", isAuthenticated, deleteProject);
router.delete("/soft-delete-project/:projectId", isAuthenticated, softDeleteProject);

router.get("/search", isAuthenticated, searchTaskProject);

export default router;
