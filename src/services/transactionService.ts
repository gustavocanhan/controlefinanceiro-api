import Transaction from "../models/Transaction";
import mongoose from "mongoose";

interface TransactionData {
  description: string;
  amount: number;
  type: "Receita" | "Despesa";
  category: string;
  date?: Date;
}

interface TransactionFilters {
  type?: "Receita" | "Despesa";
  startDate?: string;
  endDate?: string;
  category?: string;
}

const getAll = async (userId: string, filters: TransactionFilters) => {
  const query: Record<string, unknown> = { user: userId };

  if (filters.type) query.type = filters.type;
  if (filters.category) query.category = filters.category;

  if (filters.startDate || filters.endDate) {
    query.date = {
      ...(filters.startDate && { $gte: new Date(filters.startDate) }),
      ...(filters.endDate && { $lte: new Date(filters.endDate) }),
    };
  }

  return Transaction.find(query).select("-user -__v").sort({ date: -1 });
};

const getRecent = async (userId: string) => {
  return Transaction.find({ user: new mongoose.Types.ObjectId(userId) })
    .select("-user -__v")
    .sort({ date: -1 })
    .limit(5);
};

const create = async (userId: string, data: TransactionData) => {
  return Transaction.create({ ...data, user: userId });
};

const update = async (
  id: string,
  userId: string,
  data: Partial<TransactionData>,
) => {
  const transaction = await Transaction.findOneAndUpdate(
    { _id: id, user: userId },
    data,
    { new: true, runValidators: true },
  ).select("-user -__v");

  if (!transaction) {
    const error = new Error("Transação não encontrada") as Error & {
      statusCode: number;
    };
    error.statusCode = 404;
    throw error;
  }

  return transaction;
};

const remove = async (id: string, userId: string) => {
  const transaction = await Transaction.findOneAndDelete({
    _id: id,
    user: userId,
  }).select("-user -__v");

  if (!transaction) {
    const error = new Error("Transação não encontrada") as Error & {
      statusCode: number;
    };
    error.statusCode = 404;
    throw error;
  }

  return transaction;
};

const getSummary = async (userId: string) => {
  // Pega o primeiro e último dia do mês atual
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  );

  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        // Filtra apenas transações do mês atual
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth,
        },
      },
    },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
      },
    },
  ]);

  const receita = result.find((r) => r._id === "Receita")?.total || 0;
  const despesa = result.find((r) => r._id === "Despesa")?.total || 0;
  const totalReceitas = result.find((r) => r._id === "Receita")?.count || 0;
  const totalDespesas = result.find((r) => r._id === "Despesa")?.count || 0;
  const economia = receita - despesa;
  const percentEconomia = receita > 0 ? (economia / receita) * 100 : 0;

  return {
    receita,
    despesa,
    economia,
    percentEconomia,
    saldo: receita - despesa,
    totalReceitas,
    totalDespesas,
  };
};

const getMonthlyChart = async (userId: string) => {
  const now = new Date();

  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        date: { $gte: startDate },
      },
    },
    {
      $group: {
        _id: {
          month: { $month: "$date" },
          year: { $year: "$date" },
          type: "$type",
        },
        total: { $sum: "$amount" },
      },
    },
    { $sort: { "_id.year": 1, "_id.month": 1 } },
  ]);
  return result;
};

const getExpensesByCategory = async (userId: string) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    0,
    23,
    59,
    59,
  );

  const result = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: "Despesa",
        date: { $gte: startOfMonth, $lte: endOfMonth },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
      },
    },
    { $sort: { total: -1 } },
  ]);

  const totalDespesas = result.reduce((acc, item) => acc + item.total, 0);

  return result.map((item) => ({
    category: item._id,
    total: item.total,
    percentual:
      totalDespesas > 0
        ? Number(((item.total / totalDespesas) * 100).toFixed(1))
        : 0,
  }));
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
