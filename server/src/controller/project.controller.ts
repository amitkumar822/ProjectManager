import { Request, Response } from "express";
import Project from "../models/project.model";
import { IProject } from "../models/project.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError";
import Task from "../models/task.model";

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
 * @route "GET" /get-user-project?status=query&page1=&limit=10
 * @access Private
 */
export const getUserProjects = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { status } = req.query;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = { user: userId, isDeleted: false };
    if (status) {
      filter.status = status;
    }

    // Get total count for pagination
    const totalResults = await Project.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);

    const projects = await Project.find(filter)
      .populate("user", "email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (!projects || projects.length === 0) {
      throw new ApiError(404, "No Projects Found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          results: projects,
          currentPage: page,
          totalPages,
          totalResults,
        },
        "Fetched projects successfully"
      )
    );
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

/**
 * @desc  Soft Delete Project
 * @route "PUT" /soft-delete-project/:projectId
 * @access Private
 */
export const softDeleteProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { projectId } = req.params;

    const task = await Project.findOneAndUpdate(
      { _id: projectId, user: userId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!task) {
      throw new ApiError(404, "Project not found or unauthorized");
    }

    res.status(200).json(new ApiResponse(200, null, "Project moved to trash"));
  }
);

/**
 * @desc  Search Task and Project
 * @route "POST" /search?keyword=query
 * @access Private
 */
export const searchTaskProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const keyword = req.query.keyword?.toString().trim();
    const userId = req.user?.userId;

    if (!keyword) {
      throw new ApiError(400, "Search keyword is required");
    }

    const searchRegex = { $regex: keyword, $options: "i" };

    const [tasks, projects] = await Promise.all([
      Task.find({
        user: userId,
        isDeleted: false,
        $or: [{ title: searchRegex }, { description: searchRegex }],
      })
        .populate("project", "title")
        .sort({ createdAt: -1 })
        .lean(),

      Project.find({
        user: userId,
        isDeleted: false,
        $or: [{ title: searchRegex }, { description: searchRegex }],
      })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    // Merge results into one array and add a `type` field
    const combined = [
      ...tasks.map((task) => ({ ...task, type: "task" })),
      ...projects.map((project) => ({ ...project, type: "project" })),
    ];

    if (combined.length === 0) {
      throw new ApiError(404, "No matching task or project found");
    }

    // sort merged results by createdAt
    combined.sort(
      (a, b) =>
        new Date((a as any).createdAt).getTime() -
        new Date((b as any).createdAt).getTime()
    );

    res
      .status(200)
      .json(new ApiResponse(200, combined, "Combined search result fetched"));
  }
);

/**
 * @desc  Trash Delete Task and Project
 * @route "GET" /trash-delete-task-project
 * @access Private
 */
export const getTrashDeleteTaskProject = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    const [tasks, projects] = await Promise.all([
      Task.find({
        user: userId,
        isDeleted: true,
      })
        .populate("project", "title")
        .sort({ createdAt: -1 })
        .lean(),

      Project.find({
        user: userId,
        isDeleted: true,
      })
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    // Merge results into one array and add a `type` field
    const combined = [
      ...tasks.map((task) => ({ ...task, type: "task" })),
      ...projects.map((project) => ({ ...project, type: "project" })),
    ];

    if (combined.length === 0) {
      throw new ApiError(404, "No matching task or project found");
    }

    // sort merged results by createdAt
    combined.sort(
      (a, b) =>
        new Date((a as any).createdAt).getTime() -
        new Date((b as any).createdAt).getTime()
    );

    res
      .status(200)
      .json(new ApiResponse(200, combined, "Combined search result fetched"));
  }
);
