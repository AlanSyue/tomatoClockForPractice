import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { Task } from "../entity/Task";

// 取得 月/日 的格式
const formatTime = (time:Date) => {
    if(time !== null)
        return (time.getMonth()+1).toString() + '/' + (time.getDate()).toString()
    return undefined
}

// 進行日期的運算， i 表示幾天以前
const acquireDate = (today:Date, i: number) => {
    let curDate = new Date(today.valueOf()) //deep copy the Date object
    const curTime = curDate.getTime()
    const aDate = formatTime(new Date (curDate.setTime(curTime - 1000 * 60 * 60 * 24 * (i))))
    return aDate
}

// 篩選出在 days 以內 complete 或 create 的 task，其中 props 為 createdAt 或 completedAt
const FilterTask = (curTime:number ,element:Task, props:string, days: number) => {
    const date = (element[props] as unknown as Date)
    if(date != null){
        const pastTime = date.getTime()
        if(Math.abs( (curTime - pastTime)/(1000*3600*24) ) <= days)
            return element
    }
}

// 設定 todayReport 或 weeklyReport
const setTotal = (tasks: Array<Task>, today: Date, results, days, reportType, taskType) => {
    const aTask = tasks.filter(
        element => FilterTask(today.getTime(),element,taskType+"At",days)
    )
    results[reportType][taskType+"Total"] = aTask.length
}

// getReports API
const getReports = async function (req: Request, res: Response){
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

    const tasks = await getRepository(Task).find()
    const today = new Date()
    
    setTotal(tasks,today,results,1,"todayReport","created")
    setTotal(tasks,today,results,1,"todayReport","completed")
    setTotal(tasks,today,results,7,"weeklyReport","created")
    setTotal(tasks,today,results,7,"weeklyReport","completed")
    
   
    for (let i = 6 ; i >= 0 ; i--){
        const aDate = acquireDate(today,i)
        const createdNum = tasks
            .filter(element => formatTime(element.createdAt as unknown as Date) === aDate).length 
        const completedNum = tasks
            .filter(element => formatTime(element.completedAt as unknown as Date) === aDate).length
        results.dailyReport.push({
            date: aDate,
            createdTotal:createdNum,
            completedTotal:completedNum
        })
    }

    res.status(200).json({ status: 200, data: results});   
}

export { getReports }