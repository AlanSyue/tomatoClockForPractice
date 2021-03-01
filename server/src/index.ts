import * as express from 'express';
import { connectDB } from "./database";
import * as cors from 'cors';
import * as morgan from 'morgan';
import apiRouter from './main/api.routing'
import defaultExceptionHandler from './exceptions/default.exceptions';

const startServer = () => {
    // create and setup express app
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
