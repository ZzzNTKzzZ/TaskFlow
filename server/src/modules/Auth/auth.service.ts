import { generateRefreshToken, generateAccessToken } from './../../utils/token.js';
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from '../../lib/prisma.js';
import { AppError } from '../../utils/appError.js';
export class AuthService {
  static async register(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new AppError("Email already exists", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  static async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) throw new AppError("Invalid email or password", 401);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new AppError("Invalid email or password", 401);

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      accessToken,
      refreshToken,
    };
  }

  static async logout(refreshToken: string) {
    await prisma.refreshToken.delete({
      where: { token: refreshToken },
    });

    return { message: "Logged out successfully" }
  }

  static async refreshToken(refreshToken: string) {
    if (!refreshToken) throw new AppError("No refresh token provided", 401);

    let decode: any;

    try {
      decode = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string,
      );
    } catch (error) {
      throw new AppError("Refresh token expired or invalid", 401);
    }

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!storedToken || storedToken.expiresAt < new Date())
        throw new AppError("Refresh token not found", 401);
    await prisma.refreshToken.delete({
        where: { token: refreshToken}
    })

    const newAccessToken = generateAccessToken(decode.userId);
    const newRefreshToken = generateRefreshToken(decode.userId);

    await prisma.refreshToken.create({
        data: {
            userId: decode.userId,
            token: newRefreshToken,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),

        }
    })
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async getCurrentUser(userId: string) {
    if(!userId) throw new AppError("No userId provide", 401)

    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if(!user) throw new AppError("User not found", 404)
    return  {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    }
  }
}
