import { Response, NextFunction } from "express";
import { AuthRequest } from "../middlewares/authMiddleware";
import transactionService from "../services/transactionService";

// GET /api/transactions
const getAll = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const { type, startDate, endDate, category } = req.query as Record<
      string,
      string
    >;

    const transactions = await transactionService.getAll(userId, {
      type: type as "Receita" | "Despesa",
      startDate,
      endDate,
      category,
    });

    res
      .status(200)
      .json({ sucess: true, count: transactions.length, data: transactions });
  } catch (error) {
    next(error);
  }
};

// GET /api/recent
const getRecent = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await transactionService.getRecent(req.user!.id);
    res.status(200).json({ sucess: true, data: data });
  } catch (error) {
    next(error);
  }
};

// POST /api/transactions
const create = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const transaction = await transactionService.create(req.user!.id, req.body);
    res.status(201).json({ sucess: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// PUT /api/transactions/:id
const update = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };

    const transaction = await transactionService.update(
      id,
      req.user!.id,
      req.body,
    );
    res.status(200).json({ sucess: true, data: transaction });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/transactions/:id
const remove = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const { id } = req.params as { id: string };
    await transactionService.remove(id, req.user!.id);
    res
      .status(200)
      .json({ sucess: true, message: "Transação removida com sucesso" });
  } catch (error) {
    next(error);
  }
};

// GET /api/transactions/summary
const getSummary = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const summary = await transactionService.getSummary(req.user!.id);
    res.status(200).json({ sucess: true, data: summary });
  } catch (error) {
    next(error);
  }
};

// GET /api/transactions/monthly-chart
const getMonthlyChart = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await transactionService.getMonthlyChart(req.user!.id);
    res.status(200).json({ sucess: true, data: data });
  } catch (error) {
    next(error);
  }
};

// GET /api/transactions/expenses-by-category
const getExpensesByCategory = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const data = await transactionService.getExpensesByCategory(req.user!.id);
    res.status(200).json({ sucess: true, data: data });
  } catch (error) {
    next(error);
  }
};

export default {
  getAll,
  getRecent,
  create,
  update,
  remove,
  getSummary,
  getMonthlyChart,
  getExpensesByCategory,
};
