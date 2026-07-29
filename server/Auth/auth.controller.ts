import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { prisma } from "../lib/prisma.js";
import { UserRole } from "../generated/prisma/enums.js";

type RequestLike = {
  body?: Record<string, unknown>;
  user?: {
    id?: string;
    userId?: string;
  };
};

type ResponseLike = {
  status: (code: number) => ResponseLike;
  json: (body: unknown) => unknown;
  cookie?: (name: string, value: string, options?: Record<string, unknown>) => unknown;
  clearCookie?: (name: string) => unknown;
};

type NextLike = (error?: unknown) => void;

const SALT_ROUNDS = 12;

function normalizeEmail(email: unknown) {
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

function getString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is required");
  }

  return secret;
}

function signToken(user: { id: string; email: string; role: UserRole }) {
  const expiresIn = (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"];

  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    {
      expiresIn,
    },
  );
}

function hashResetToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function publicUser(user: {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

function sendAuthResponse(res: ResponseLike, statusCode: number, user: Parameters<typeof publicUser>[0]) {
  const token = signToken(user);

  res.cookie?.("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.status(statusCode).json({
    message: "Authentication successful",
    token,
    user: publicUser(user),
  });
}

export async function register(req: RequestLike, res: ResponseLike, next: NextLike) {
  try {
    const name = getString(req.body?.name);
    const email = normalizeEmail(req.body?.email);
    const password = getString(req.body?.password);

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: UserRole.USER,
      },
    });

    return sendAuthResponse(res, 201, user);
  } catch (error) {
    return next(error);
  }
}

export async function login(req: RequestLike, res: ResponseLike, next: NextLike) {
  try {
    const email = normalizeEmail(req.body?.email);
    const password = getString(req.body?.password);

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user?.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    return sendAuthResponse(res, 200, user);
  } catch (error) {
    return next(error);
  }
}

export async function forgotPassword(req: RequestLike, res: ResponseLike, next: NextLike) {
  try {
    const email = normalizeEmail(req.body?.email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const genericMessage = "If an account exists, a password reset link has been sent";

    if (!user) {
      return res.status(200).json({ message: genericMessage });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = hashResetToken(resetToken);
    const expiresInMinutes = Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES ?? 15);
    const passwordResetExpiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetTokenHash: resetTokenHash,
        passwordResetExpiresAt,
      },
    });

    return res.status(200).json({
      message: genericMessage,
      resetToken: process.env.NODE_ENV === "production" ? undefined : resetToken,
    });
  } catch (error) {
    return next(error);
  }
}

export async function resetPassword(req: RequestLike, res: ResponseLike, next: NextLike) {
  try {
    const token = getString(req.body?.token);
    const password = getString(req.body?.password);

    if (!token || !password) {
      return res.status(400).json({ message: "Reset token and new password are required" });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const resetTokenHash = hashResetToken(token);

    const user = await prisma.user.findFirst({
      where: {
        passwordResetTokenHash: resetTokenHash,
        passwordResetExpiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Reset token is invalid or expired" });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });

    return sendAuthResponse(res, 200, updatedUser);
  } catch (error) {
    return next(error);
  }
}

export async function changePassword(req: RequestLike, res: ResponseLike, next: NextLike) {
  try {
    const userId = req.user?.id ?? req.user?.userId;
    const currentPassword = getString(req.body?.currentPassword);
    const newPassword = getString(req.body?.newPassword);

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user?.passwordHash) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid current password" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: await bcrypt.hash(newPassword, SALT_ROUNDS),
        passwordResetTokenHash: null,
        passwordResetExpiresAt: null,
      },
    });

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return next(error);
  }
}

export async function getCurrentUser(req: RequestLike, res: ResponseLike, next: NextLike) {
  try {
    const userId = req.user?.id ?? req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
}

export function logout(_req: RequestLike, res: ResponseLike) {
  res.clearCookie?.("token");

  return res.status(200).json({ message: "Logged out successfully" });
}

export const authController = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser,
  logout,
};
