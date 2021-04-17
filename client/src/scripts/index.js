import * as analysis from './parts/analysis';
import * as todolist from './parts/todolist'
import * as tomato from './parts/tomato';
import * as layout from './layout';
import * as icon from './icon';
import * as auth from './auth';
import $ from 'jquery';

$('document').ready(async function() {
    await analysis.init();
    await todolist.init();
    await tomato.init();
    await layout.init();
    await icon.init();
    await auth.init();
})
