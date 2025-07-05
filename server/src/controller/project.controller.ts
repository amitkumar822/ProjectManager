import { Request, Response } from "express";
import Project from "../models/project.model";
import { IProject } from "../models/project.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";

/**
 * @desc  Create new Project
 * @mainRoute /api/v1/project
 * @route "POST" /create-project
 * @access Private
 */
export const createProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { title, description } = req.body;

    if (!title || !description) {
      throw new ApiError(400, "title and description are required fields");
    }

    const project: IProject = await Project.create({
      title,
      description,
      user: userId,
    });

    res
      .status(201)
      .json(new ApiResponse(201, project, "Project create successfully"));
  }
);

/**
 * @desc  Get All User Project
 * @route "GET" /get-user-project?status=query
 * @access Private
 */
export const getUserProjects = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { status } = req.query;

    // Build dynamic filter object
    const filter: Record<string, any> = { user: userId };

    if (status) {
      filter.status = status;
    }

    const projects = await Project.find(filter)
      .populate("user", "email")
      .sort({ createdAt: -1 })
      .lean();

    if (!projects || projects.length === 0) {
      throw new ApiError(404, "No Projects Found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, projects, "Fetched projects successfully"));
  }
);

/**
 * @desc  Update project
 * @route "PUT" /update-project/:projectId
 * @access Private
 */
export const updateProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    const userId = req.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new ApiError(400, "Invalid Project ID");
    }

    const { title, description, status } = req.body;

    // Prepare only non-empty fields for update
    const updateFields: Record<string, any> = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (status !== undefined) updateFields.status = status;

    const project = await Project.findOneAndUpdate(
      { _id: projectId, user: userId },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!project) {
      throw new ApiError(404, "Project not found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, project, "Project updated successfully"));
  }
);

/**
 * @desc  Delete project
 * @route "DELETE" /delete-project/:projectId
 * @access Private
 */
export const deleteProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;
    const userId = req.user?.userId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new ApiError(400, "Invalid project ID format");
    }

    const deletedProject = await Project.findOneAndDelete({
      _id: projectId,
      user: userId,
    });

    if (!deletedProject) {
      throw new ApiError(404, "Project not found or access denied");
    }

    res
      .status(200)
      .json(new ApiResponse(200, null, "Project deleted successfully"));
  }
);
