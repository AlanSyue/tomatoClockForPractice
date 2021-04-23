import $ from 'jquery';
import { register, login, getUser } from './api';

const showLoginCard = () => {
    $('#login-card').show();
    $('#register-card').hide();
    $('.container').addClass('blur');
    blurBackground(true)
}

const showRegisterCard = () => {
    $('#register-card').show();
    $('#login-card').hide();
    blurBackground(true)
}

const closeAllAuthCard = () => {
    $('#register-card').hide();
    $('#login-card').hide();
    blurBackground(false);
}

const blurBackground = (isEnable) => {
    if (isEnable) {
        $('.container').addClass('blur');
    } else {
        $('.container').removeClass('blur');
    }
}

const registerAccount = async () => {
    const nickname = $('#register-nickname').val();
    const email = $('#register-email').val();
    const password = $('#register-password').val();
    if (nickname === '' || email === '' || password === '') {
        alert('Required fields are missing');
        return;
    }

    try {
        const result = await register({
            name: nickname,
            email: email,
            password: password
        });
    } catch {
        alert('Something went wrong');
        return;
    }
    alert(result.msg);
    location.reload();
}

const loginAccount = async () => {
    const email = $('#login-email').val();
    const password = $('#login-password').val();
    if (email === '' || password === '') {
        alert('Required fields are missing');
        return;
    }

    try {
        const result = await login({
            email: email,
            password: password
        });
        const token = result.token;
        localStorage.setItem('token', token);

        const userData = await getUser(token);
        const username = userData.data.name;

        alert(result.msg);
        closeAllAuthCard();
        $('#user-name').html(`${username} 你好`);

    } catch {
        alert('Something went wrong');
        return;
    }
}

const checkIsLogin = async () => {
    const token = localStorage.getItem('token');
    if (typeof token == 'undefined') {
        return;
    }
    try {
        const userData = await getUser(token);
        const username = userData.data.name;

        $('#user-name').html(`${username} 你好`);
        $('#login').hide();
        $('#register').hide();
        $('#logout').show();
    } catch {
        return;
    }
}

const logoutAccount = () => {
    localStorage.removeItem("token");
    location.reload();
}

function init() {
    checkIsLogin();
    $('#login').click(showLoginCard);
    $('#register').click(showRegisterCard);
    $('#logout').click(logoutAccount);
    $('#register-link').click(showRegisterCard);
    $('.close').click(closeAllAuthCard);
    $('#register-submit').click(registerAccount);
    $('#login-submit').click(loginAccount);
}

export {
    init,
};
