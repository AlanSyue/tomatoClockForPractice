import * as express from 'express';
import * as cors from 'cors'
import { connectDB } from "./database";
import apiRouter from "./main/api.routing"
import defaultExceptionHandler from './exception/default.exception'

const startServer = () => {

    // Create and setup express app
    const app: express.Application = express();
    
    // Deal with JSON
    app.use(express.json());

    // Deal with CORS
    app.use(cors());

    // Routing
    app.use('/api',apiRouter);

    // Error Handling
    app.use(defaultExceptionHandler)

    // Start express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API Server is running at port ${port}.`));
}

(async () => {
    await connectDB();
    startServer();
})()



