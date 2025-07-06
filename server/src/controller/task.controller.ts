import { Request, Response } from "express";
import Task, { ITask } from "../models/task.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import mongoose, { FilterQuery, UpdateQuery } from "mongoose";

/**
 * @desc  Create task
 * @mainRoute /api/v1/task
 * @route "POST" /create-task/:projectId
 * @access Private
 */
export const createTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { projectId } = req.params;
    const { title, description, dueDate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      throw new ApiError(400, "Invalid Project ID");
    }

    if (!title || !description || !dueDate) {
      throw new ApiError(
        400,
        "All fields (title, description, dueDate) are required"
      );
    }

    // Validate and format dueDate
    const parsedDueDate = new Date(dueDate);
    if (isNaN(parsedDueDate.getTime())) {
      throw new ApiError(400, "Invalid date format. Use YYYY-MM-DD format.");
    }

    const task = await Task.create({
      title,
      description,
      dueDate: parsedDueDate,
      project: projectId,
      user: userId,
    });

    res
      .status(201)
      .json(new ApiResponse(201, task, "Create task successfully"));
  }
);

/**
 * @desc  Get All User Task
 * @route "GET" /get-all-task?status=query&page1=&limit=10
 * @access Private
 */
export const getAllUserTasks = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    const { status } = req.query;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const filter: FilterQuery<ITask> = { user: userId, isDeleted: false };
    if (status) {
      filter.status = status || "";
    }
    

    // Get total count for pagination
    const totalResults = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);

    const tasks = await Task.find(filter)
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (!tasks || tasks.length === 0) {
      throw new ApiError(404, "Task Not Found");
    }

    res.status(200).json(
      new ApiResponse(
        200,
        {
          results: tasks,
          currentPage: page,
          totalPages,
          totalResults,
        },
        "Get task successfully"
      )
    );
  }
);

/**
 * @desc  Get All User Task BY ID
 * @route "GET" /project/:projectId/tasks?status=query&page1=&limit=10
 * @access Private
 */
export const getTasksByProjectId = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { projectId } = req.params;

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const { status } = req.query;

    const filter: FilterQuery<ITask> = { project: projectId, isDeleted: false };
    if (status) {
      filter.status = status;
    }

    const totalResults = await Task.countDocuments(filter);
    const totalPages = Math.ceil(totalResults / limit);

    const tasks = await Task.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    if (!tasks || tasks.length === 0) {
      throw new ApiError(404, "No tasks found for this project");
    }

    // Return empty list if no tasks on this page
    res.status(200).json(
      new ApiResponse(
        200,
        {
          results: tasks,
          currentPage: page,
          totalPages,
          totalResults,
        },
        "Tasks fetched successfully"
      )
    );
  }
);

/**
 * @desc  Update User Task
 * @route "PUT" /update-task/:taskId
 * @access Private
 */
export const updateTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { taskId } = req.params;

    if (!taskId || !userId) {
      throw new ApiError(400, "Task ID or User ID is missing");
    }

    // ✅ Ensure at least one field is being updated
    const updatableFields = ["title", "description", "status", "dueDate"];
    const hasUpdate = updatableFields.some((field) => field in req.body);
    if (!hasUpdate) {
      throw new ApiError(400, "No valid fields provided for update");
    }

    const filter: FilterQuery<ITask> = {
      _id: taskId,
      user: userId,
    };

    const updateData: UpdateQuery<ITask> = req.body;

    const updatedTask = await Task.findOneAndUpdate(filter, updateData, {
      new: true,
    });

    if (!updatedTask || updateTask.length === 0) {
      throw new ApiError(404, "Task not found or unauthorized");
    }

    res
      .status(200)
      .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
  }
);

/**
 * @desc  Delete User Task
 * @route "PUT" /delete-task/:taskId
 * @access Private
 */
export const deleteTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { taskId } = req.params;

    if (!userId || !taskId) {
      throw new ApiError(400, "User ID or Task ID missing");
    }

    const filter: FilterQuery<ITask> = {
      _id: taskId,
      user: userId,
    };

    const deletedTask = await Task.findOneAndDelete(filter);

    if (!deletedTask) {
      throw new ApiError(404, "Task not found or unauthorized");
    }

    res
      .status(200)
      .json(new ApiResponse(200, null, "Task deleted successfully"));
  }
);

/**
 * @desc  Soft Delete Task
 * @route "PUT" /soft-delete-task/:taskId
 * @access Private
 */
export const softDeleteTask = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;
    const { taskId } = req.params;

    const task = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!task) {
      throw new ApiError(404, "Task not found or unauthorized");
    }

    res.status(200).json(new ApiResponse(200, null, "Task moved to trash"));
  }
);
