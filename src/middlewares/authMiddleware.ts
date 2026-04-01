import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/User";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as { id: string };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(401).json({ message: "Usuário não encontrado." });
      return;
    }

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido ou expirado." });
  }
};

export { protect };
