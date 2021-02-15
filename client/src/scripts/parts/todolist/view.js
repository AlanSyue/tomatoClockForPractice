import $ from "jquery";
import {init as iconInit} from '../../icon';
import { renderTodolist as tomatoRenderTodolist } from '../tomato';

function renderList(array){
    $("#todolist ul").empty();
    if (typeof array == 'undefined' || array.length <= 0) {
        return;
    }
    for (var i = 0; i < array.length; i++) {
        var { id, content, completed } = array[i];
        $("#todolist ul").append(
            createItem(id, content, completed)
        );
    }
    tomatoRenderTodolist();
    iconInit();
}

// demo
function createItem2(id, name, status){
    var isFinish = status == true;
    if(isFinish){
        return `
            <li class="${id}">
                <div class="item-block">
                    <div class="block-left">
                        <button value="${id}" class="check-btn finished">
                            <span value="${id}" class="check finished"><i class="fas fa-check"></i></span>
                        </button>
                        <h3 class="word finished">${name}</h3>
                    </div>
                </div>
                <hr class=" separate">
            </li>
        `
    }
    return `
        <li class="${id}">
            <div class="item-block">
                <div class="block-left">
                    <button value="${id}" class="check-btn">
                        <span value="${id}" class="check"><i class="fas fa-check"></i></span>
                    </button>
                    <h3 class="word">${name}</h3>
                </div>
                <div class="block-right">
                    <span value="${id}" class="edit"><i class="fas fa-pen"></i></span>
                    <span value="${id}" class="delete"><i class="fas fa-times"></i></span>
                </div>
            </div>
            <hr class=" separate">
        </li>
    `
}

function createItem(id, name, status) {
    var li = document.createElement("li");
    li.setAttribute("class", id);
    var div_block = addDiv("item-block");
    var block_left = addDiv("block-left");
    var block_right = addDiv("block-right");
    var check_Btn;
    if (!status) {
        check_Btn = addButton("check-btn", id);
        check_Btn.appendChild(addCheck("check", id));
    } else {
        check_Btn = addButton("check-btn finished", id);
        check_Btn.disabled = true;
        check_Btn.appendChild(addCheck("check finished", id));
    }
    block_left.appendChild(check_Btn);
    if (!status) {
        block_left.appendChild(addWord("word", name));
        block_right.appendChild(addPen("edit", id));
        block_right.appendChild(addClose("delete", id));
    } else {
        block_left.appendChild(addWord("word finished", name));
    }
    div_block.appendChild(block_left);
    div_block.appendChild(block_right);
    li.appendChild(div_block);
    li.appendChild(addHr());
    return li;
}

function addDiv(attr) {
    var div = document.createElement("div");
    div.setAttribute("class", attr);
    return div;
}
function addButton(attr, id) {
    var btn = document.createElement("button");
    btn.setAttribute("class", attr);
    btn.setAttribute("value", id);
    return btn;
}

function addWord(attr, name) {
    var word = document.createElement("h3");
    word.setAttribute("class", attr);
    word.innerHTML = name;
    return word;
}

function addPen(attr, id) {
    var span = document.createElement("span");
    span.setAttribute("class", attr);
    span.setAttribute("value", id);
    span.innerHTML =
        '<svg class="svg-inline--fa fa-pen fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="pen" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path></svg>';
    return span;
}

function addClose(attr, id) {
    var span = document.createElement("span");
    span.setAttribute("class", attr);
    span.setAttribute("value", id);
    span.innerHTML =
        '<svg class="svg-inline--fa fa-times fa-w-11" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352 512" data-fa-i2svg=""><path fill="currentColor" d="M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z"></path></svg>';
    return span;
}

function addHr() {
    var hr = document.createElement("hr");
    hr.setAttribute("class", "separate");
    return hr;
}

function addCheck(attr, id) {
    var span = document.createElement("span");
    span.setAttribute("class", attr);
    span.setAttribute("value", id);
    span.innerHTML =
        '<svg class="svg-inline--fa fa-check fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"></path></svg>';
    return span;
}

export {
    renderList,
    createItem
}
