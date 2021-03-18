import * as controller from './report.controller';
import { Task } from "../entity/Task";
import * as moment from "moment";

describe('formatTaskReport', () => {
    test('default empty result', () => {
        expect(typeof controller.formatTaskReport).toBe('function');
    });

    test('default empty result', () => {
        // setup
        const tasks = [];
        const expected = {
            todayReport: {
                createdTotal: 0,
                completedTotal: 0
            },
            weeklyReport: {
                createdTotal: 0,
                completedTotal: 0
            },
            dailyReport: [
                {
                    date: moment().subtract(6, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(5, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(4, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(3, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(2, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(1, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                }
            ]
        }

        // execute
        const actual = controller.formatTaskReport(tasks);

        // verify
        expect(actual).toEqual(expected);
    })

    test('with 2 created task', () => {
        // setup
        const task1 = new Task();
        task1.createdAt = moment().subtract(1, 'days').toISOString();

        const task2 = new Task();
        task2.createdAt = moment().toISOString();

        const tasks = [task1, task2];

        const expected = {
            todayReport: {
                createdTotal: 1,
                completedTotal: 0
            },
            weeklyReport: {
                createdTotal: 2,
                completedTotal: 0
            },
            dailyReport: [
                {
                    date: moment().subtract(6, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(5, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(4, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(3, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(2, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(1, 'days').format("M/DD"),
                    createdTotal: 1,
                    completedTotal: 0
                },
                {
                    date: moment().format("M/DD"),
                    createdTotal: 1,
                    completedTotal: 0
                }
            ]
        }

        // execute
        const actual = controller.formatTaskReport(tasks);

        // verify
        expect(actual).toEqual(expected);
    })


    test('with 1 completed task', () => {
        // setup
        const task1 = new Task();
        task1.createdAt = moment().toISOString();
        task1.completed = true;
        task1.completedAt = moment().toISOString();

        const tasks = [task1];

        const expected = {
            todayReport: {
                createdTotal: 1,
                completedTotal: 1
            },
            weeklyReport: {
                createdTotal: 1,
                completedTotal: 1
            },
            dailyReport: [
                {
                    date: moment().subtract(6, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(5, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(4, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(3, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(2, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(1, 'days').format("M/DD"),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().format("M/DD"),
                    createdTotal: 1,
                    completedTotal: 1
                }
            ]
        }

        // execute
        const actual = controller.formatTaskReport(tasks);

        // verify
        expect(actual).toEqual(expected);
    })
})