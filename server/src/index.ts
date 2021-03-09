import * as express from 'express';
import * as cors from 'cors'

import { connectDB } from "./database";
import taskRoute from './tasks/task.routing'
import reportsRoute from './reports/report.routing'

const startServer = () => {

    // Create and setup express app
    const app: express.Application = express();
    
    // Deal with JSON
    app.use(express.json());

    // Deal with CORS
    app.use(cors());

    // Routing
    app.use('/api/tasks',taskRoute);
    app.use('/api/reports',reportsRoute);

    // Error Handling
    app.use((err,req:express.Request,res:express.Response,next)=>{
        res.status(500).send('Something wrong');
    })

    // Start express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API Server is running at port ${port}.`));
}

(async () => {
    await connectDB();
    await startServer();
})()



