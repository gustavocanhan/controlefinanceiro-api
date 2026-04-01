import mongoose, { Document, Schema } from "mongoose";

export interface ITransaction extends Document {
  description: string;
  amount: number;
  type: "Receita" | "Despesa";
  category: string;
  user: mongoose.Types.ObjectId;
  date: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    description: {
      type: String,
      required: [true, "Descrição é obrigatório"],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Valor é obrigatório"],
      min: [0.01, "Valor deve ser maior que zero"],
    },
    type: {
      type: String,
      enum: ["Receita", "Despesa"],
      required: true,
    },
    category: {
      type: String,
      required: [true, "Categoria é obrigatório"],
      trim: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITransaction>("Transaction", TransactionSchema);
