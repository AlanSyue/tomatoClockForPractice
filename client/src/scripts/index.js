import * as analysis from './parts/analysis';
import * as todolist from './parts/todolist'
import * as tomato from './parts/tomato';
import * as layout from './layout';
import * as icon from './icon';
import * as api from './api';
import $ from 'jquery';

$('document').ready(function(){
    analysis.init();
    todolist.init();
    tomato.init();
    layout.init();
    icon.init();
})
