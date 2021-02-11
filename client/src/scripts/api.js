import $ from 'jquery';
import * as config from './config';

function callApi(url, method = 'GET', data = {}) {
    return $.ajax({
        type: method,
        url: config.API_URL + url,
        dataType: "json",
        contentType: 'application/json',
        data: data,
        async: false,
        success: function (res, textStatus, xhr) {
            return res.data;
        },
    });
}

async function getAllTasks() {
    return await callApi('/tasks');
}

function getTasksById(id) {
    return callApi(`/tasks/${id}`);
}

function addTask(data) {
    return callApi('/tasks', 'POST', data);
}

function updateTask(id, data) {
    return callApi(`/tasks/${id}`, 'PATCH', data);
}

function deleteTask(id) {
    return callApi(`/tasks/${id}`, 'DELETE');
}

export {
    getAllTasks,
    getTasksById,
    addTask,
    updateTask,
    deleteTask
};
