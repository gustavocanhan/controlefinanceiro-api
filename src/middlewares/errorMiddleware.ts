import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
  code?: number;
}

const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Erro interno do servidor";

  // ID inválido do MongoDB
  if (err.name === "CastError") {
    statusCode = 400;
    message = "ID inválido";
  }

  // Campo duplicado (ex: email já cadastrado)
  if (err.code === 11000) {
    statusCode = 400;
    message = "Esse registro já existe";
  }

  // Erros de validação do Mongoose
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  res.status(statusCode).json({
    sucess: false,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export { errorHandler };
