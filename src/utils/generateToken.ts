import jwt from "jsonwebtoken";

const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign({ id: userId }, secret, { expiresIn } as jwt.SignOptions);
};

export default generateToken;
