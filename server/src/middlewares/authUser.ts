import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

// Extend Express Request to include custom `user` field
declare module "express-serve-static-core" {
  interface Request {
    user?: {
      userId: string;
      email: string;
      role?: string;
    };
  }
}

// Custom token payload interface
interface TokenPayload extends JwtPayload {
  userId: string;
}

export const isAuthenticated = asyncHandler(
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    if (!accessToken && !refreshToken) {
      throw new ApiError(401, "Session invalid. Please log in again.");
    }

    try {
      // Try verifying access token
      const decodedToken = jwt.verify(
        accessToken,
        process.env.JWT_ACCESS_SECRET_KEY!
      ) as TokenPayload;

      const user = await User.findById(decodedToken.userId);
      if (!user)
        throw new ApiError(
          404,
          "Unauthorized access: User is not authenticated"
        );

      req.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      return next();
    } catch (err: any) {
      // Token expired or invalid
      if (
        err.name === "TokenExpiredError" ||
        err.name === "JsonWebTokenError"
      ) {
        if (!refreshToken) {
          throw new ApiError(401, "Session expired. Please log in again.");
        }

        try {
          // Try verifying refresh token
          const decodedRefresh = jwt.verify(
            refreshToken,
            process.env.JWT_REFRESH_SECRET_KEY!
          ) as TokenPayload;

          const user = await User.findById(decodedRefresh.userId);
          if (!user) {
            throw new ApiError(404, "User not found");
          }

          // Create new access token
          accessToken = jwt.sign(
            { userId: user._id.toString() },
            process.env.JWT_ACCESS_SECRET_KEY!,
            {
              expiresIn: "15m",
            }
          );

          res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 15 * 60 * 1000,
          });

          req.user = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
          };

          return next();
        } catch (refreshErr) {
          throw new ApiError(
            401,
            "Refresh token expired. Please log in again."
          );
        }
      }

      throw new ApiError(401, "Invalid token. Please log in again.");
    }
  }
);
