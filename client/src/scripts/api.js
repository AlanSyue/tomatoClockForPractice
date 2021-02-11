import $ from 'jquery';

function callApi(url, method = 'GET', data = {}) {
    $.ajax({
        type: method,
        url: url,
        dataType: "json",
        contentType: 'application/json',
        data: data,
        success: function (data, textStatus, xhr) {
            return data;
        },
    });
}

function getAllTasks() {
    return callApi('/tasks');
}

function getTasksById(id) {
    return callApi(`/tasks/${id}`);
}

function addTask(data) {
    return callApi('/tasks', 'POST', data);
}

export {
    getAllTasks
};
