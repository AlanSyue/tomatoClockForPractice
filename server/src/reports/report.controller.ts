import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Task } from "../entity/Task";

// 取得 月/日 的格式
const formatTime = (time: Date) => {
    if (time !== null)
        return (time.getMonth() + 1).toString() + '/' + (time.getDate()).toString()
    return undefined
}

// 進行日期的運算， i 表示幾天以前
const acquireDate = (today: Date, i: number) => {
    let curDate = new Date(today.valueOf()) //deep copy the Date object
    const curTime = curDate.getTime()
    const aDate = formatTime(new Date(curDate.setTime(curTime - 1000 * 60 * 60 * 24 * (i))))
    return aDate
}

const getDailyReport = (tasks: Array<Task>) => {
    const today = new Date()
    const buffer = []

    for (let i = 6; i >= 0; i--) {
        const aDate = acquireDate(today, i)
        const createdNum = tasks
            .filter(element => formatTime(new Date(element.createdAt)) === aDate).length
        const completedNum = tasks
            .filter(element => formatTime(new Date(element.completedAt)) === aDate).length

        buffer.push({
            date: aDate,
            createdTotal: createdNum,
            completedTotal: completedNum
        })
    }

    return buffer;
}

export const formatTaskReport = (tasks: Array<Task>) => {
    const reports = getDailyReport(tasks);

    const todayReport = reports[reports.length - 1];
    const weeklyReport = reports.reduce((temp, report) => {
        temp.createdTotal += report.createdTotal;
        temp.completedTotal += report.completedTotal;
        return temp;
    }, {
        createdTotal: 0,
        completedTotal: 0
    });

    let results = {
        todayReport: {
            createdTotal: todayReport.createdTotal,
            completedTotal: todayReport.completedTotal,
        },
        weeklyReport: weeklyReport,
        dailyReport: reports
    }

    return results;
}

// getReports API
const getReports = async function (req: Request, res: Response) {
    const tasks = await getRepository(Task).find()
    const results = formatTaskReport(tasks);
    res.status(200).json({ status: 200, data: results });
}

export { getReports }