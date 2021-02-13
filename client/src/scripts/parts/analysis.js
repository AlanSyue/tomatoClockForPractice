import $ from 'jquery';
import {
    getReport
} from "./todolist/model";

async function init(){
    const reportData = await getReport();
    $("#today-total").html(reportData.data.today.createdTotal);
    $("#today-completed").html(reportData.data.today.completedTotal);
    $("#week-total").html(reportData.data.weeklyReport.createdTotal);
    $("#week-completed").html(reportData.data.weeklyReport.completedTotal);

    const year = new Date().getFullYear();
    const dailyReportData = reportData.data.dailyReport;

    let weekReportDate = "";
    let weekReportNumberList = [];
    let weekReportDateList = [];
    let roundKey = 0;
    dailyReportData.forEach((data) => {
        roundKey++;
        // week report date
        weekReportDate += `
            <div class="square${roundKey}">
                <p>${data.date}</p>
            </div>
        `;
        // week report number
        weekReportNumberList.push(data.completedTotal);
        // week report date
        weekReportDateList.push(data.date);
    });

    weekReportNumberList = [...new Set(weekReportNumberList)];
    // 由小到大排序
    weekReportNumberList.sort(function (a, b) {
        return b - a
    });

    let weekReportNumber = "";
    weekReportNumberList.forEach((number) => {
        weekReportNumber += `
            <p>${number}</p>
        `;
    });

    $("#week-report-number").html(weekReportNumber);
    $("#week-report-date").html(weekReportDate);

    let today = "";
    if (weekReportDateList.length > 0) {
        today = year + '/' + weekReportDateList.shift();
    }

    let lastDay = "";
    if (weekReportDateList.length > 0) {
        lastDay = year + '/' + weekReportDateList.pop();
    }

    $("#today-text").html(today);
    $("#week-range-text").html(today + " ~ " + lastDay);
}

export {
    init
};
