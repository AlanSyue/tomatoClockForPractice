import { createConnection } from 'typeorm';

export const connectDB = async () => {
  await createConnection();
};