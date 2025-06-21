import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const verifyPassword = async (
  databasePassword: string,
  inputPassword: string,
): Promise<Boolean> => {
  return bcrypt.compare(inputPassword, databasePassword);
};

const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, "SECRETE", { expiresIn: "24h" });
};
export { hashPassword, verifyPassword, generateToken };
