import * as express from 'express';
import { Request, Response } from 'express';
import { connectDB } from "./database";
import { getRepository, MoreThan } from "typeorm";
import { Task } from "./entity/Task";
import * as moment from 'moment';

const startServer = () => {
    // create and setup express app
    const app: express.Application = express();
    app.use(express.json());

    // register routes
    app.get("/api/tasks", async function (req: Request, res: Response) {
        const taskRepository = getRepository(Task);
        const tasks = await taskRepository.find();
        res.status(200).json({ status: 200, data: tasks });
    });

    app.post("/api/tasks", async function (req: Request, res: Response) {
        const taskRepository = getRepository(Task);
        const task = await taskRepository.create(req.body)
        const result = await taskRepository.save(task);
        res.status(200).json({ status: 200, data: result });
    });

    app.patch("/api/tasks/:id", async function (req: Request, res: Response) {
        const taskRepository = getRepository(Task);
        const task = await taskRepository.findOne(req.params.id);
        const {
            content,
            completed
        } = req.body;

        let updateData = {};
        if (content) {
            updateData['updateData'] = content;
        }
        if (completed) {
            updateData['completed'] = completed;
            updateData['completedAt'] = completed ? moment() : null;
        }
        taskRepository.merge(task, updateData);
        const result = await taskRepository.save(task);
        res.status(200).json({ status: 200, data: result });
    });

    app.delete("/api/tasks/:id", async function (req: Request, res: Response) {
        const taskRepository = getRepository(Task);
        await taskRepository.delete(req.params.id);
        res.status(200).json({ status: 200, data: {} });
    });

    app.get("/api/reports", async function (req: Request, res: Response) {
        interface Report {
            date: string,
            createdTotal: number,
            completedTotal: number
        }
        interface ReportMap {
            [name: string]: Report
        }
        interface ResponseData {
            todayReport: {
                createdTotal: number,
                completedTotal: number,
            },
            weeklyReport: {
                createdTotal: number,
                completedTotal: number,
            },
            dailyReport: Array<Report>
        }
        const DATE_FORMAT: string = 'MM/DD';
        const taskRepository = getRepository(Task);
        const reportStartDate = moment().subtract(6, 'day').format('YYYY-MM-DD');
        const createdTasksPromise = taskRepository.find({
            createdAt: MoreThan(reportStartDate)
        });
        const completedTasksPromise = taskRepository.find({
            completedAt: MoreThan(reportStartDate)
        });
        const [createdTasks, completedTasks] = await Promise.all([createdTasksPromise, completedTasksPromise]);

        const reportMap: ReportMap = Array(7)
            .fill('')
            .map((v, idx) => idx)
            .reduce((counter, dateDiff) => {
                const momentObj = moment().subtract(dateDiff, 'day');
                const report: Report = { date: momentObj.format(DATE_FORMAT), createdTotal: 0, completedTotal: 0 };
                counter[momentObj.format(DATE_FORMAT)] = report;
                return counter;
            }, {});

        createdTasks.forEach(task => {
            const date = moment(task.createdAt).format(DATE_FORMAT);
            const newReport = { ...reportMap[date] };
            newReport.createdTotal += 1;
            reportMap[date] = newReport;
        })

        completedTasks.forEach(task => {
            const date = moment(task.completedAt).format(DATE_FORMAT);
            const newReport = { ...reportMap[date] };
            newReport.completedTotal += 1;
            reportMap[date] = newReport
        })

        const todayString = moment().format(DATE_FORMAT);
        const reposts = Object.values(reportMap);
        const weeklyReport = reposts.reduce((result, rep: Report) => {
            result.createdTotal += rep.createdTotal;
            result.completedTotal += rep.completedTotal;
            return result;
        }, { createdTotal: 0, completedTotal: 0 })
        const sortByDateAsc = (r1: Report, r2: Report): number => (r1.date < r2.date ? -1 : 1);
        const responseData: ResponseData = {
            todayReport: {
                createdTotal: reportMap[todayString].createdTotal,
                completedTotal: reportMap[todayString].completedTotal
            },
            weeklyReport: {
                createdTotal: weeklyReport.createdTotal,
                completedTotal: weeklyReport.completedTotal
            },
            dailyReport: reposts.sort(sortByDateAsc)
        }
        res.status(200).json({ status: 200, data: responseData });
    });

    // start express server
    const port = process.env.PORT || 3000;
    app.listen(port, () => console.log(`API Server is running at port ${port}.`));
}

(async () => {
    await connectDB();
    await startServer();
})();
