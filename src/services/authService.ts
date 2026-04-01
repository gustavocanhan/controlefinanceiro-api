import User from "../models/User";
import generateToken from "../utils/generateToken";

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

const register = async (data: RegisterData): Promise<AuthResponse> => {
  const { name, email, password } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email já cadastrado") as Error & {
      statusCode: number;
    };
    error.statusCode = 400;
    throw error;
  }

  const user = await User.create({ name, email, password });
  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    token,
  };
};

const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    const error = new Error("Credenciais inválidas") as Error & {
      statusCode: number;
    };
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const error = new Error("Credencias inválidas") as Error & {
      statusCode: number;
    };
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(user._id.toString());

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    },
    token,
  };
};

export default { register, login };
