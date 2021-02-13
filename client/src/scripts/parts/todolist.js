import $ from "jquery";
import {
    renderList,
} from "./todolist/view";
import {
    getTodolist,
    deleteItemById,
    setFinishTodolist as _setFinishTodolist,
    editItemById,
    getTodolistByStatus
} from "./todolist/model";
import * as api from '../api';

async function init() {
    //初始化頁面
    await showNotFinishList();
    $(".top-left .left").click(showNotFinishList);
    $(".top-left .right").click(showfinishList);
    $("#add-button").click(addNote);
    $("ul").on("click", ".edit", editItem);
    $("ul").on("click", ".delete", deleteItem);
    $("ul").on("click", ".check-btn", checkItem);
}

async function showNotFinishList() {
    $(".top-left .left").css("opacity", "0.5");
    $(".top-left .right").css("opacity", "1");
    var status = false;
    var noteArray = await getTodolistByStatus(status);
    renderList(noteArray);
}

async function showfinishList() {
    $(".top-left .left").css("opacity", "1");
    $(".top-left .right").css("opacity", "0.5");
    var status = true;
    var noteArray = await getTodolistByStatus(status);
    renderList(noteArray);
}

async function addNote() {
    var inputValue = $("#add-text").val();
    $("#add-text").val("");
    if (inputValue == "") {
        return ;
    }
    await api.addTask({
        content: inputValue
    })
    showNotFinishList();
}

function checkItem(id) {
    var id = $(this).attr("value");
    setFinishTodolist(id);
}

function setFinishTodolist(id){
    if (_setFinishTodolist(id)) {
        showNotFinishList();
    }
}

function editItem() {
    var id = $(this).attr("value");
    var text = $('li.'+ id +' .word').text();
    Swal.fire({
        title: "請輸入修改記事",
        input: "text",
        inputValue:text,
        showCancelButton: true,
        heightAuto:false,
        inputValidator: value => {
            if (!value) {
                return "請輸入修改記事";
            }
        }
    }).then(async result => {
        if (!result.value) {
            return ;
        }
        await editItemById(id, result.value);
        showNotFinishList();
    });
}

function deleteItem(id) {
    var id = $(this).attr("value");
    deleteItemById(id);
    showNotFinishList();
}

export {
    init,
    getTodolist,
    getTodolistByStatus,
    setFinishTodolist
};
