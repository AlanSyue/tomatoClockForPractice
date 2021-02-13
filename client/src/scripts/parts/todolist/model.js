import * as api from '../../api';

async function getTodolist() {
    var res = await api.getAllTasks();
    return res.data.tasks;
}

async function getTodolistByStatus(status) {
    var res = await api.getAllTasks(true, status);
    return res.data.tasks;
}

async function setFinishTodolist(id) {
    return await api.updateTask(id, {
        completed: true
    });
}

async function editItemById(id, text) {
    await api.updateTask(id, {
        content: text
    });
}

async function deleteItemById(id) {
    return await api.deleteTask(id);
}

async function getReport() {
    return await api.getReport();
} 

export {
    setFinishTodolist,
    deleteItemById,
    getTodolist,
    editItemById,
    getTodolistByStatus,
    getReport
}
