import { Router } from 'express'
import * as controller from './report.controller';


const reportRouter = Router();

// get
reportRouter.route("/")
    .get(controller.getReports);



export default reportRouter

