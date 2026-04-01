import { Request, Response, NextFunction } from "express";
import authService from "../services/authService";

// POST /api/auth/register
const register = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ sucess: true, data: result });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email e senha são obrigatórios" });
      return;
    }

    const result = await authService.login(email, password);
    res.status(200).json({ sucess: true, data: result });
  } catch (error) {
    next(error);
  }
};

export default { register, login };
