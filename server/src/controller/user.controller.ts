import { Request, Response } from "express";
import User, { IUser } from "../models/user.model";
import createTokensAndSetCookies from "../utils/createTokensAndSetCookies";
import { ApiResponse } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import mongoose from "mongoose";
import Task from "../models/task.model";
import Project from "../models/project.model";

/**
 * @desc  Create new User
 * @mainRoute /api/v1/user
 * @route "POST" /register
 * @access Public
 */
export const registerUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required fields");
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new ApiError(409, "User already exists");
    }

    const user = (await User.create({ email, password })) as IUser;

    const users = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    res
      .status(201)
      .json(new ApiResponse(201, users, "User login successfully"));
  }
);

/**
 * @desc  User Login
 * @route "POST" /login
 * @access Public
 */
export const loginUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "Email and password are required fields");
    }

    const user = (await User.findOne({ email }).select("+password")) as IUser;

    if (!user || !(await user.comparePassword(password))) {
      throw new ApiError(401, "Invalid credentials");
    }

    const token = await createTokensAndSetCookies(user._id.toString(), res);

    const users = {
      _id: user._id,
      email: user.email,
      role: user.role,
      token,
    };

    res
      .status(200)
      .json(new ApiResponse(200, users, "User login successfully"));
  }
);

/**
 * @desc  User Logout
 * @route "POST" /logout
 * @access Private
 */
export const logoutUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId;

    if (!userId) {
      throw new ApiError(401, "Unauthorized. User ID not found.");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    user.refreshToken = "";
    await user.save();

    // Clear accessToken cookies
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Clear refreshToken cookies
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res
      .status(200)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  }
);

/**
 * @desc  Get All User
 * @route "GET" /get-all-users
 * @access Private
 */
export const getAllUsers = asyncHandler(
  async (_req: Request, res: Response) => {
    const users = await User.find().select("-password").lean();

    if (!users || users.length === 0) {
      throw new ApiError(404, "User Not Found");
    }

    res
      .status(200)
      .json(new ApiResponse(200, users, "All user gets successfully"));
  }
);

/**
 * @desc  Get All User
 * @route "GET" /get-user/:userId
 * @access Private
 */
export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  const user = await User.findById(userId).select("-password").lean();

  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  res.status(200).json(new ApiResponse(200, user, "User gets successfully"));
});

/**
 * @desc  Update User Details
 * @route "PUT" /update-user
 * @access Private
 */
export const updateUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const userId = req.user?.userId;

    const user = (await User.findById(userId).select(
      "+password"
    )) as IUser | null;

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (email) user.email = email;

    await user.save();

    res
      .status(200)
      .json(new ApiResponse(200, null, "User updated successfully"));
  }
);

/**
 * @desc  Delete User
 * @route "GET" /delete-user/:userId
 * @access Private
 */
export const deleteUser = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Check if any incomplete tasks exist
    const incompleteTasks = await Task.findOne({
      user: userId,
      status: { $ne: "done" },
    });

    if (incompleteTasks) {
      throw new ApiError(400, "User has tasks that are not marked as 'done'");
    }

    // Check if any non-completed projects exist
    const activeProjects = await Project.findOne({
      user: userId,
      status: { $ne: "completed" },
    });

    if (activeProjects) {
      throw new ApiError(
        400,
        "User has projects that are not marked as 'completed'"
      );
    }

    // Passed all checks, proceed to delete user
    await user.deleteOne();

    res
      .status(200)
      .json(new ApiResponse(200, null, "User deleted successfully"));
  }
);
