import { Response } from "express";
import jwt, { Secret } from "jsonwebtoken";
import User from "../models/user.model";
import { config } from "dotenv";
config();

interface TokenPayload {
  userId: string;
}

const createTokensAndSetCookies = async (
  userId: string,
  res: Response
): Promise<{ accessToken: string; refreshToken: string }> => {
  if (
    !process.env.JWT_ACCESS_SECRET_KEY ||
    !process.env.JWT_REFRESH_SECRET_KEY
  ) {
    throw new Error("JWT secret keys are not set in environment variables.");
  }

  const accessToken = jwt.sign(
    { userId } as TokenPayload,
    process.env.JWT_ACCESS_SECRET_KEY as Secret,
    {
      expiresIn: "1d",
    }
  );

  const refreshToken = jwt.sign(
    { userId } as TokenPayload,
    process.env.JWT_REFRESH_SECRET_KEY as Secret,
    {
      expiresIn: "5d",
    }
  );

  // ✅ Use lowercase "none"
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
  });

  await User.findByIdAndUpdate(userId, { refreshToken });

  return { accessToken, refreshToken };
};

export default createTokensAndSetCookies;
