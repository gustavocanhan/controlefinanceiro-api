import app from "./app";
import connectDB from "./config/db";

const PORT = process.env.PORT || 5000;

const StartServer = async (): Promise<void> => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 Ambiente: ${process.env.NODE_ENV}`);
    console.log(`🔗 http://localhost:${PORT}/health`);
  });
};

StartServer();
