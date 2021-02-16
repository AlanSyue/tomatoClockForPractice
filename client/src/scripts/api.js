import $ from 'jquery';
import * as config from './config';

function callApi(url, method = 'GET', data = {}) {
    return $.ajax({
        type: method,
        url: config.API_URL + url,
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(data),
        async: false,
        success: function (res, textStatus, xhr) {
            return res.data;
        },
    });
}

async function getAllTasks(needFilter = false, filterStatus = null) {
    let url = '/tasks';
    if (needFilter) {
        const status = filterStatus == true ? 'completed' : 'uncompleted';
        url += `?filterType=${status}`;
    }
    return await callApi(url);
}

async function getTasksById(id) {
    return await callApi(`/tasks/${id}`);
}

async function addTask(data) {
    return await callApi('/tasks', 'POST', data);
}

async function updateTask(id, data) {
    return await callApi(`/tasks/${id}`, 'PATCH', data);
}

async function deleteTask(id) {
    return await callApi(`/tasks/${id}`, 'DELETE');
}

async function getReport() {
    return await callApi('/reports')
}

export {
    getAllTasks,
    getTasksById,
    addTask,
    updateTask,
    deleteTask,
    getReport
};
