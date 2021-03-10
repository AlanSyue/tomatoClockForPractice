import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Task } from "../../entity/Task";
const oneDay = 1000*60*60*24;
//formatTime from UTC to month/date
const formatTime = (time:Date) => {
    if(time !== null)//因 js 內建 0 為一月 1 為二月，故 getMonth+1 為該月份
        return (time.getMonth()+1).toString() + '/' + (time.getDate()).toString();
    else
        return undefined;
}
// calculate the numbers of days between two dates(count means: how many day)
const pastDate = (today:Date, count: number) => {
    let currentDate = new Date(today.valueOf());
    const currentTime = currentDate.getTime();
    const pastDate = formatTime(new Date (currentDate.setTime(currentTime - count*oneDay)))
    return pastDate;
}
// 若 task 為七天以內則 return
const FilterTask = (currentTime:number ,Task:Task, status:string, days: number) => {
    const date = (Task[status]);
    if(date != null){
        const pastTime = date.getTime();
        const diffDays = Math.round(Math.abs((currentTime - pastTime) / oneDay));
        if(diffDays <= days)
            return Task;//更新後的 task
    }
}
// set today report json value
const setToday = (tasks: Array<Task>, today: Date, results, taskType) => {
    const countTask = tasks.filter(
        Task => FilterTask(today.getTime(),Task,taskType+"At",1)
    )
    results["todayReport"][taskType+"Total"] = countTask.length;
}
// set weekly report json value
const setWeekly = (tasks: Array<Task>, today: Date, results, taskType) => {
    const countTask = tasks.filter(
        Task => FilterTask(today.getTime(),Task,taskType+"At",7)
    )
    results["weeklyReport"][taskType+"Total"] = countTask.length;
}
// getReports API
export const getReports = async function (req: Request, res: Response){
    //get Task all value
    const tasks = await getRepository(Task).find();
    //get completed = true value
    const completedTasks =  await getRepository(Task).find({where: { completed: true }});
    const today = new Date();
    //set 初始值
    let results = {
        todayReport:{
            createdTotal: 0,
            completedTotal: 0
        },
        weeklyReport:{
            createdTotal: 0,
            completedTotal: 0
        },
        dailyReport:[]
    }
    //set todayReport value
    setToday(tasks,today,results,"created");
    setToday(completedTasks,today,results,"completed");
    //set weeklyreport value
    setWeekly(tasks,today,results,"created");
    setWeekly(completedTasks,today,results,"completed");
    //set dailyreport value
    for (let i = 6 ; i >= 0 ; i--){
        const pDate = pastDate(today,i);
        const createdNum = tasks.filter(element => formatTime(element.createdAt as unknown as Date) === pDate).length;
        const completedNum = completedTasks.filter(element => formatTime(element.completedAt as unknown as Date) === pDate).length;
        results.dailyReport.push({
            date: pDate,
            createdTotal:createdNum,
            completedTotal:completedNum
        })
    }
    res.status(200).json({ status: 200, data: results});
}
export default getReports;