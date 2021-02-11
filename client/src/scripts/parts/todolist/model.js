function getTodolist() {
    var todolist = JSON.parse(localStorage.getItem("noteStr"));
    if(!todolist){
        return [];
    }
    return todolist;
}

function getTodolistByStatus(status){
    var noteArray = getTodolist();
    var output = [];
    for (var i = 0; i < noteArray.length; i++) {
        var row = noteArray[i];
        if (row.status == status) {
            output.push(row);
        }
    }
    return output;
}

function saveTodolist(array) {
    if (array.length == 0) {
        localStorage.removeItem("noteStr");
    }else{
        localStorage.setItem("noteStr", JSON.stringify(array));
    }
}

function setFinishTodolist(id) {
    var noteArray = getTodolist();
    var isUpdated = false;
    for (var i = 0; i < noteArray.length; i++) {
        if (noteArray[i].id == id) {
            noteArray[i].status = true;
            noteArray[i].finishAt = getCurrentTime();
            isUpdated = true;
        }
    }
    if(isUpdated){
        saveTodolist(noteArray);
        return true;
    }
    return false;
}

function editItemById(id, text){
    var noteArray = getTodolist();
    for (var i = 0; i < noteArray.length; i++) {
        if (noteArray[i].id == id) {
            noteArray[i].name = text;
            break;
        }
    }
    saveTodolist(noteArray);
}

function deleteItemById(id){
    var noteArray = getTodolist();
    for (var i = 0; i < noteArray.length; i++) {
        if (id == noteArray[i].id) {
            noteArray.splice(i, 1);
            break;
        }
    }
    saveTodolist(noteArray);
}

function getNextId(array){
    var id = 1;
    if(array.length == 0){
        return id;
    }
    return array[array.length - 1].id + 1;
}

function storeNote(text) {
    var noteArray = getTodolist();
    var createTime = getCurrentTime();
    var nextId = getNextId(noteArray);
    var newNote = {
        id: nextId,
        name: text,
        status: false,
        createAt: createTime,
        finishAt: null
    };
    noteArray.push(newNote);
    saveTodolist(noteArray);
    return newNote;
}

function getCurrentTime() {
    var today = new Date();
    var date =
        today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
    var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date + " " + time;

    return dateTime;
}

export {
    storeNote,
    setFinishTodolist,
    deleteItemById,
    getTodolist,
    editItemById,
    getTodolistByStatus
}