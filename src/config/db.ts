import mongoose from "mongoose";

const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGO_URI as string;

    if (!mongoURI) {
      throw new Error("MONGO_URI não definida no .env");
    }

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB conectado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao conectar no MongoDB: ", error);
    process.exit(1);
  }
};

export default connectDB;
