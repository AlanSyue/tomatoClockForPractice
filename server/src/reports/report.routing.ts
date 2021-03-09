import { Router } from 'express'

import * as controller from './report.controller';

const reportRoute = Router();

// get
reportRoute.get("/", controller.getReports);



export default reportRoute

