/* eslint-disable no-console */

import CryptoJS from 'crypto-js';
import Config from '../config';

export const Base64 = {
    encrypt: text => {
        const b = new Buffer(text);
        return b.toString('base64');
    },
    decrypt: text => {
        const b = new Buffer(text, 'base64');
        return b.toString();
    }
};

export const md5 = text => {
    return CryptoJS.MD5(text).toString();
};

export const DES = {
    encrypt: (text, key, iv = 0) => {
        let secretkey = (CryptoJS.MD5(key).toString()).substr(0, 16);
        let secretiv = (CryptoJS.MD5(iv).toString()).substr(24, 8);
        // console.log('real key:', secretkey);
        // console.log('real iv:', secretiv);
        secretkey = CryptoJS.enc.Utf8.parse(secretkey);
        secretiv = CryptoJS.enc.Utf8.parse(secretiv);
        const result = CryptoJS.DES.encrypt(text, secretkey, {
            iv: secretiv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return result.toString();
    },
    decrypt: (text, key, iv = 0) => {
        let secretkey = (CryptoJS.MD5(key).toString()).substr(0, 16);
        let secretiv = (CryptoJS.MD5(iv).toString()).substr(24, 8);
        secretkey = CryptoJS.enc.Utf8.parse(secretkey);
        secretiv = CryptoJS.enc.Utf8.parse(secretiv);
        const result = CryptoJS.DES.decrypt(text, secretkey, {
            iv: secretiv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return result.toString(CryptoJS.enc.Utf8);
    }
};

export const AES = {
    encrypt: (text, key, iv = 0) => {
        let secretkey = (CryptoJS.MD5(key).toString()).substr(16, 16);
        let secretiv = (CryptoJS.MD5(iv).toString()).substr(0, 16);
        // console.log('real key:', secretkey);
        // console.log('real iv:', secretiv);
        secretkey = CryptoJS.enc.Utf8.parse(secretkey);
        secretiv = CryptoJS.enc.Utf8.parse(secretiv);
        const result = CryptoJS.AES.encrypt(text, secretkey, {
            iv: secretiv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return result.toString();
    },
    decrypt: (text, key, iv = 0) => {
        let secretkey = (CryptoJS.MD5(key).toString()).substr(16, 16);
        let secretiv = (CryptoJS.MD5(iv).toString()).substr(0, 16);
        secretkey = CryptoJS.enc.Utf8.parse(secretkey);
        secretiv = CryptoJS.enc.Utf8.parse(secretiv);
        const result = CryptoJS.AES.decrypt(text, secretkey, {
            iv: secretiv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
        return result.toString(CryptoJS.enc.Utf8);
    }
};

export const JSONFORMATE = {
    jsonFormatter: textValue => {
        let res = '';
        for (let i = 0, j = 0, k = 0, ii, ele; i < textValue.length; i++) { // k:缩进，j:""个数
            ele = textValue.charAt(i);
            if (j % 2 === 0 && ele === '}') {
                k -= 1;
                for (ii = 0; ii < k; ii++) ele = '    ' + ele;
                ele = '\n' + ele;
            } else if (j % 2 === 0 && ele === '{') {
                ele += '\n';
                k += 1;
                for (ii = 0; ii < k; ii++) ele += '    ';
            } else if (j % 2 === 0 && ele === ',') {
                ele += '\n';
                for (ii = 0; ii < k; ii++) ele += '    ';
            } else if (ele === '"') {
                j += 1;
            }
            res += ele;
        }
        return res;
    }
};

export default {
    Base64,
    md5,
    DES,
    AES,
    JSONFORMATE
};