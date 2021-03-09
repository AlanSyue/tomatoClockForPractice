import { createConnection } from 'typeorm';

/* database 的基本操作寫在這裡 */

export const connectDB = async () => {
  await createConnection()
};

