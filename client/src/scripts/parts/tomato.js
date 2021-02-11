import $ from 'jquery';
import { setFinishTodolist, getTodolistByStatus } from './todolist';

const ON = 1;
const OFF = 2;
const ORANGE = 'ORANGE';
const GREEN = 'GREEN';
const UNFINISH = 0;

var viewMode = ORANGE;
var countDownNumber = 1500;
var countDownID;
var countDownGoing = false;
var $countDownTime = $("#clock");

function init(){

    loopUpdateOutputDate();
    renderTodolist();

    $(".green").hide();
    $("#bellSlash").hide();
    
    $("#bell").click(function() { changeBellStatus(OFF); });
    $("#bellSlash").click(function() { changeBellStatus(ON); });

    $("#orangePlay").click(function() { changeOrangeState(ON); });
    $("#orangePause").click(function() { changeOrangeState(OFF); });

    $("#greenPlay").click(function() { changeGreenState(ON); });
    $("#greenPause").click(function() { changeGreenState(OFF); });
    
    $("#orangeCancel").click(function() { changeToGreenMode(); });
    $("#greenCancel").click(function() { changeToOrangeMode(); });

    $("#finishCheckONE").click(function() { finishWhichOne(0); });
    $("#finishCheckTWO").click(function() { finishWhichOne(1); });
    $("#finishCheckTHREE").click(function() { finishWhichOne(2); });
    $("#finishCheckFOUR").click(function() { finishWhichOne(3); });
}

function loopUpdateOutputDate() {
    var timeNow = new Date();
    var weekDays = "星期日,星期一,星期二,星期三,星期四,星期五,星期六".split(",");

    $("#nowDatetimeFront").text(timeNow.getFullYear() + "."
        + (timeNow.getMonth() < 10 ? '0' : '') + (timeNow.getMonth() + 1) + "."
        + (timeNow.getDate() < 10 ? '0' : '') + timeNow.getDate());

    $("#nowDatetimeBack").text(weekDays[timeNow.getDay()]
        + (timeNow.getHours() < 10 ? '0' : '') + timeNow.getHours() + ":"
        + (timeNow.getMinutes() < 10 ? '0' : '') + timeNow.getMinutes());
    
    setTimeout(loopUpdateOutputDate, 1000);
}

function countDown() {
    if (countDownNumber <= 0) {
        clearTimeout(countDownID);
        if (viewMode == ORANGE) {
            changeToGreenMode();
        }
        else {
            changeToOrangeMode();
        }
    }
    else {
        countDownNumber--;
        var countDownMin = Math.floor(countDownNumber / 60);
        var countDownSec = countDownNumber % 60
        $countDownTime.text((countDownMin < 10 ? '0' : '') + countDownMin + ":"
            + (countDownSec < 10 ? '0' : '') + countDownSec);
    
        countDownID = setTimeout(countDown, 1000);
    }
}

function startCount() {
    if (countDownGoing == false) {
        countDownGoing = true;
        countDown();
    }
}

function stopCount() {
    clearTimeout(countDownID);
    countDownGoing = false;
}

function changeToOrangeMode() {
    countDownNumber = 1500;
    $countDownTime.text("25:00");
    stopCount();
    $(".orange").show();
    $(".green").hide();
    viewMode = ORANGE;
}

function changeBellStatus(bellState) {
    if(bellState == ON) {
        $("#bell").show();
        $("#bellSlash").hide();
    }
    else {
        $("#bellSlash").show();
        $("#bell").hide();
    }
}

function changeOrangeState(param) {
    if(param == ON) {
        $("#orangePause").show();
        $("#orangePlay").hide();
        countDownGoing = false;
        startCount();
    }
    else {
        $("#orangePause").hide();
        $("#orangePlay").show();
        stopCount();
    }
}

function changeToGreenMode() {
    countDownNumber = 300;
    $countDownTime.html("05:00");
    stopCount();
    $(".green").show();
    $(".orange").hide();
    viewMode = GREEN;
}

function changeGreenState(param) {
    if(param == ON) {
        $("#greenPause").show();
        $("#greenPlay").hide();
        countDownGoing = false;
        startCount();
    }
    else {
        $("#greenPause").hide();
        $("#greenPlay").show();
        stopCount();
    }
}

function renderTodolist() {     
    var notFinish = getTodolistByStatus(UNFINISH);
    hideAllListItem(notFinish.length);
    for (var i = 0; i < notFinish.length; i++) {
        var readObject = notFinish[i];
        if (i == 0) {
            $("#finishCheckONE").css("opacity", "1");
            $("#listONE").text(readObject.name);
        }
        else if (i == 1) {
            $("#finishCheckTWO").css("opacity", "1");
            $("#listTWO").text(readObject.name);
        }
        else if (i == 2) {
            $("#finishCheckTHREE").css("opacity", "1");
            $("#listTHREE").text(readObject.name);
        }
        else if (i == 3) {
            $("#finishCheckFOUR").css("opacity", "1");
            $("#listFOUR").text(readObject.name);
        }
    }
}

function hideAllListItem() {
    $("#finishCheckONE").css("opacity", "0");
    $("#finishCheckTWO").css("opacity", "0");
    $("#finishCheckTHREE").css("opacity", "0");
    $("#finishCheckFOUR").css("opacity", "0");
    $("#listONE").text("");
    $("#listTWO").text("");
    $("#listTHREE").text("");
    $("#listFOUR").text("");
}

function setFinish(whichOneFinish) {
    var notFinish = getTodolistByStatus(UNFINISH);
    var readObject = notFinish[whichOneFinish];
    setFinishTodolist(readObject.id);  
}

function finishWhichOne(clickedButton) {
    setFinish(clickedButton);
    renderTodolist();
}

export {
    init,
    renderTodolist
};