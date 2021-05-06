import express from 'express';
import { connectDB } from "./database";
import cors from 'cors';
import morgan from 'morgan';
import apiRouter from './main/api.routing'
import defaultExceptionHandler from './exceptions/default.exceptions';
import dotenv from 'dotenv';

const startServer = () => {
    // create and setup express app
    dotenv.config();
    const app: express.Application = express();
    app.use(cors());
    app.use(morgan('dev'));
    app.use('/api', apiRouter);
    app.use(defaultExceptionHandler);

    // start express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API Server is running at port ${port}.`));
}

(async () => {
    await connectDB();
    startServer();
})();
