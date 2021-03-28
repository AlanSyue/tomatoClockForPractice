import { Request, Response } from 'express';
import { HttpStatus } from '../../common/response/response.type'
import { getRepository, Between } from "typeorm";
import { Task } from "../../entity/Task";

const ONE_DAY = 1000 * 60 * 60 * 24

const getTimeStamp = (today:Date, i: number):number => {
    let curDate = new Date(today.valueOf()) //deep copy the Date object
    const curTime = curDate.getTime()
    const timestamp = curDate.setTime(curTime - ONE_DAY * i)
    return timestamp
}

const createDate = (timestamp = 0) => {
    if(timestamp)
        return new Date( new Date(timestamp).toISOString() )
    return new Date( new Date().toISOString() )
}

const formatDate = (time:Date) => {
    if(time !== null)
        return (time.getMonth()+1).toString() + '/' + (time.getDate()).toString()
    return undefined
}

// getReports API
const getReports = async function (req: Request, res: Response){
    const today = createDate()
    const taskRepository = getRepository(Task)
    const conditionMap = {
        todayCreated: { where: { createdAt: Between( createDate( getTimeStamp(today,1) ), today ) } },
        todayCompleted: { where: { completedAt: Between( createDate( getTimeStamp(today,1) ), today ) } },
        weeklyCreated: { where: { createdAt: Between( createDate( getTimeStamp(today,7) ), today ) } },
        weeklyCompleted: { where: { completedAt: Between( createDate( getTimeStamp(today,7) ), today ) } }
    }

    let tasks = []
    for ( let condition in conditionMap ){
        tasks.push(await taskRepository.find(conditionMap[condition]))
    }

    let report = {
        todayReport:{
            createdTotal: tasks[0].length,
            completedTotal: tasks[1].length
        },
        weeklyReport:{
            createdTotal: tasks[2].length,
            completedTotal: tasks[3].length
        },
        dailyReport:[]
    }
    
    for (let i = 6 ; i >= 0 ; i--) {
        const aDate = formatDate(createDate(getTimeStamp(today,i)))
        const createdNum = tasks[2] 
            .filter(element => formatDate(element.createdAt as unknown as Date) === aDate).length 
        const completedNum = tasks[3] 
            .filter(element => formatDate(element.completedAt as unknown as Date) === aDate).length
        
        report.dailyReport.push({
            date: aDate,
            createdTotal:createdNum,
            completedTotal:completedNum
        })
    }

    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, data: report})
}

export { getReports }