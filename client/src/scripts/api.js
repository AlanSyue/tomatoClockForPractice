import $ from 'jquery';
import * as config from './config';

function callApi(url, method = 'GET', data = {}, header = {}) {
    return $.ajax({
        type: method,
        url: config.API_URL + url,
        dataType: "json",
        contentType: 'application/json',
        data: JSON.stringify(data),
        headers: header,
        async: false,
        success: function (res, textStatus, xhr) {
            return res.data;
        },
        error: function (res, textStatus, errorThrown) {
            return JSON.parse(res.responseText);
        }
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

async function register(data) {
    const res = await callApi('/auth/register', 'POST', data);

    if (res.status == 401) {
        return {
            'status': 'failed',
            'msg': resText.errors.email,
        }
    }

    if (res.status == 400) {
        return {
            'status': 'failed',
            'msg': 'Information Incorrect',
        }
    }

    return {
        'status': 'success',
        'msg': 'Please verify your email',
    }
}

async function login(data) {
    const res = await callApi('/auth/signin', 'POST', data);

    if (res.status == 401) {
        return {
            'status': 'failed',
            'msg': res.errors.email,
        }
    }

    return {
        'status': 'success',
        'msg': 'Login Successfully',
        'token': res.data.token,
    }
}

async function getUser(token) {
    return await callApi('/user', 'GET', {}, {token: token});
}

export {
    getAllTasks,
    getTasksById,
    addTask,
    updateTask,
    deleteTask,
    getReport,
    register,
    login,
    getUser,
};
