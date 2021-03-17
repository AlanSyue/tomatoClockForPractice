import * as controller from './report.controller';
import { Task } from "../../entity/Task";
import moment from 'moment';

describe('formatReport: ', () => {

    test('test function exists', () => {
        expect(typeof controller.formatReport).toBe('function');
    })

    test('test empty data', () => {
        // setup
        const createdTasks: Array<Task> = [];
        const completedTasks: Array<Task> = [];
        const expected = {
            todayReport: {
                createdTotal: 0,
                completedTotal: 0,
            },
            weeklyReport: {
                createdTotal: 0,
                completedTotal: 0,
            },
            dailyReport: [
                {
                    date: moment().subtract(6, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(5, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(4, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(3, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(2, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(1, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(0, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                }
            ]
        };

        // execute
        const actual = controller.formatReport(createdTasks, completedTasks);

        // verify
        expect(actual).toEqual(expected);
    })

    test('test with a created task on today.', () => {
        // setup
        const task = new Task();
        task.createdAt = moment().toISOString();

        const createdTasks: Array<Task> = [
            task
        ];
        const completedTasks: Array<Task> = [];
        const expected = {
            todayReport: {
                createdTotal: 1,
                completedTotal: 0,
            },
            weeklyReport: {
                createdTotal: 1,
                completedTotal: 0,
            },
            dailyReport: [
                {
                    date: moment().subtract(6, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(5, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(4, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(3, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(2, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(1, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(0, 'day').format('MM/DD'),
                    createdTotal: 1,
                    completedTotal: 0
                }
            ]
        };

        // execute
        const actual = controller.formatReport(createdTasks, completedTasks);

        // verify
        expect(actual).toEqual(expected);
    })


    test('test with a task completed on today.', () => {
        // setup
        const task1 = new Task();
        task1.createdAt = moment().subtract(1, 'day').toISOString();

        const task2 = new Task();
        task2.createdAt = moment().subtract(1, 'day').toISOString();
        task2.completed = true;
        task2.completedAt = moment().toISOString();

        const createdTasks: Array<Task> = [
            task1,
            task2
        ];

        const completedTasks: Array<Task> = [
            task2
        ];

        const expected = {
            todayReport: {
                createdTotal: 0,
                completedTotal: 1,
            },
            weeklyReport: {
                createdTotal: 2,
                completedTotal: 1,
            },
            dailyReport: [
                {
                    date: moment().subtract(6, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(5, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(4, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(3, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(2, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(1, 'day').format('MM/DD'),
                    createdTotal: 2,
                    completedTotal: 0
                },
                {
                    date: moment().subtract(0, 'day').format('MM/DD'),
                    createdTotal: 0,
                    completedTotal: 1
                }
            ]
        };

        // execute
        const actual = controller.formatReport(createdTasks, completedTasks);

        // verify
        expect(actual).toEqual(expected);
    })
})