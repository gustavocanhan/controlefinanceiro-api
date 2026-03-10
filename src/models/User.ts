import bcrypt from "bcryptjs";
import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Nome é obrigatório"],
      trim: true,
      maxlength: [50, "Nome não pode ter mais de 50 caracteres"],
    },
    email: {
      type: String,
      required: [true, "Email é obrigatório"],
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email inválido"],
      select: false,
    },
  },
  {
    timestamps: true,
  },
);
