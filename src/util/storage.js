import { Base64, AES } from './crypto/';
import Config from './config';

export const localStorageUtil = {
    save: (name, value) => {
        let text = JSON.stringify(value);
        text = Base64.encrypt(text);
        text = AES.encrypt(text, Config.key.aes_local_key, Config.key.aes_local_iv);
        try {
            localStorage.setItem(name, text);
        } catch (oException) {
            if (oException.name === 'QuotaExceededError') {
                console.log('超出本地存储限额！');
                localStorage.clear();
                localStorage.setItem(name, text);
            }
        }
    },
    check: name => {
        return localStorage.getItem(name);
    },
    getValue: name => {
        let text = localStorage.getItem(name);
        let result = null;
        if (text) {
            text = AES.decrypt(text, Config.key.aes_local_key, Config.key.aes_local_iv);
            text = Base64.decrypt(text);
            result = JSON.parse(text);
        }
        return result;
    },
    remove: name => {
        localStorage.removeItem(name);
    }
};

export const sessionStorageUtil = {
    save: (name, value) => {
        let text = JSON.stringify(value);
        text = Base64.encrypt(text);
        text = AES.encrypt(text, Config.key.aes_local_key, Config.key.aes_local_iv);
        try {
            sessionStorage.setItem(name, text);
        } catch (oException) {
            if (oException.name === 'QuotaExceededError') {
                console.log('超出本地存储限额！');
                sessionStorage.clear();
                sessionStorage.setItem(name, text);
            }
        }
    },
    check: name => {
        return sessionStorage.getItem(name);
    },
    getValue: name => {
        let text = sessionStorage.getItem(name);
        let result = null;
        if (text) {
            text = AES.decrypt(text, Config.key.aes_local_key, Config.key.aes_local_iv);
            text = Base64.decrypt(text);
            result = JSON.parse(text);
        }
        return result;
    },
    remove: name => {
        sessionStorage.removeItem(name);
    }
};

export const cookieUtil = {
    getCookie: cookieName => {
        if (document.cookie.length > 0) {
            let getName = Base64.encrypt(cookieName);
            getName = AES.encrypt(getName, Config.key.aes_local_key, Config.key.aes_local_iv);
            let startIndex = document.cookie.indexOf(getName + '=');
            if (startIndex !== -1) {
                startIndex += getName.length + 1;
                let endIndex = document.cookie.indexOf(';', startIndex);
                if (endIndex === -1) endIndex = document.cookie.length;
                let result = unescape(document.cookie.substring(startIndex, endIndex));
                result = AES.decrypt(result, Config.key.aes_local_key, Config.key.aes_local_iv);
                result = Base64.decrypt(result);
                return result;
            }
        }
        return '';
    },
    setCookie: (cookieName, value, expiredays) => {
        let saveName = Base64.encrypt(cookieName);
        saveName = AES.encrypt(saveName, Config.key.aes_local_key, Config.key.aes_local_iv);
        let text = Base64.encrypt(value);
        text = AES.encrypt(text, Config.key.aes_local_key, Config.key.aes_local_iv);
        console.log('cookie length:', text.length);
        const expireDate = new Date();
        expireDate.setDate(expireDate.getDate() + expiredays);
        document.cookie = saveName + '=' + escape(text) +
            ((expiredays == null) ? '' : ';expires=' + expireDate.toGMTString()) + '; path=/';
    },
    checkCookie: (cookieName, expiredays) => {
        // let getName = Base64.encrypt(cookieName);
        // getName = AES.encrypt(getName, Config.key.aes_local_key, Config.key.aes_local_iv);
        const cookie = cookieUtil.getCookie(cookieName);
        if (cookie) {
            // this.setCookie(cookieName, cookie, expiredays);
            return true;
        }
        return false;
    }
};

export default {
    localStorageUtil,
    sessionStorageUtil,
    cookieUtil,
};