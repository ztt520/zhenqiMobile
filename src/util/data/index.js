/* eslint-disable no-console */
import pako from 'pako';
import axios from 'axios';

import { Message } from 'element-ui';
import { Base64, md5, DES, AES } from '../crypto/';
import { localStorageUtil } from '../storage';
import Config from '../config';
import { getSmpFormatNowDate, getFormatDate, getFormatDateHourAdd } from '../timeformat';

export function getData(url, method, object, callback, period) {
    const paramobj = {};
    paramobj.appId = Config.CommonParams.appId;
    paramobj.method = method;
    paramobj.timestamp = (new Date()).getTime();
    paramobj.clienttype = Config.CommonParams.clienttype;
    const newobject = {};
    Object.keys(object).sort().map(item => {
        newobject[item] = object[item];
        return newobject;
    });
    paramobj.object = newobject;
    let secret = paramobj.appId + paramobj.method + paramobj.timestamp + paramobj.clienttype + JSON.stringify(paramobj.object);
    secret = md5(secret);
    paramobj.secret = secret;
    const paramtext = JSON.stringify(paramobj);
    const paramciphertext = DES.encrypt(paramtext, Config.key.des_client_key, Config.key.des_client_iv);

    // console.log('参数对象:', paramtext);
    // console.log('参数密文:', paramciphertext);

    let param = 'param=' + paramciphertext;
    param = param.replace(/\+/g, '%2B');
    param = decodeURI(param);
    // console.log('传递参数:', param);

    axios(url, {
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: 'POST',
            data: param
        })
        .then(res => {
            // console.log('返回结:', res);
            return res.data;
        })
        .then(res => {
            // console.log('返回结果密文:', res);
            let text = DES.decrypt(res, Config.key.des_server_key, Config.key.des_server_iv);
            // console.log('DES解码:', text);
            text = AES.decrypt(text, Config.key.aes_server_key, Config.key.aes_server_iv);
            // console.log('AES解码:', text);
            text = Base64.decrypt(text);
            // console.log('返回明文结果:', text);
            callback(text);
            // const resultobj = JSON.parse(text);
        })
        .catch(res => {
            Message({ message: res, type: 'error', duration: 5000 })
            console.log('其他异常:', url, method, object, res);
            // throw new Error(res);
        });
};

function getDataFromLocalStorage(key, period) {
    if (typeof period === 'undefined') {
        period = 0;
    }
    let data = localStorageUtil.getValue(key);
    if (data) { // 判断是否过期
        const time = data.time;
        const current = new Date().getTime();
        if (new Date().getHours() >= 0 && new Date().getHours() < 5) {
            period = 1;
        }
        if (current - (period * 60 * 60 * 1000) > time) { // 更新
            data = null;
        }
        // 防止1-5点用户不打开页面，跨天的情况
        if (new Date().getHours() >= 5 && new Date(time).getDate() !== new Date().getDate() && period === 24) {
            data = null;
        }
    }
    return data;
}

export function getServerData(url, method, object, callback, period) {

    url = Config.host + url;
    const key = md5(url + method + JSON.stringify(object));
    const data = getDataFromLocalStorage(key, period);
    if (!data) {
        getData(url, method, object, text => {
            const resultobj = JSON.parse(text);
            if (resultobj.errcode === 0) {
                if (period > 0) {
                    resultobj.result.time = new Date().getTime(); // 添加当前时间
                    localStorageUtil.save(key, resultobj.result);
                }
                callback(resultobj.result);
            } else {
                Message({ message: resultobj.errmsg, type: 'error', duration: 5000 })

                // console.log('业务逻辑异常:', resultobj.errmsg);
            }
        }, period);
    } else {
        callback(data);
    }
};

export function getGzipData(time, type, level, callback) {
    let url = Config.windhost;
    if (!time) {
        time = getSmpFormatNowDate();
    }

    let timestr = getFormatDateHourAdd(time, -8, 'yyyyMMddhh') + '00';
    const datestr = timestr.substr(0, 8);
    let resolution = '0.25';
    if (level < 5) {
        let hour = timestr.substr(8, 4);
        const timelist = ['0000', '0300', '0600', '0900', '1200', '1500', '1800', '2100'];
        for (let i = 0; i < timelist.length; i++) {
            if (hour >= timelist[i] && hour < timelist[i + 1]) {
                hour = timelist[i];
                break;
            }
            if (i === timelist.length - 1) {
                hour = timelist[i];
                break;
            }
        }
        timestr = datestr + hour;
        resolution = '1.0';
    }
    url += `gzip/${datestr}/${resolution}/${timestr}-${type}-surface-level-gfs-${resolution}.json`;
    axios(url, {
            headers: {
                'Accept': 'text/plain',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            method: 'GET'
        })
        .then(res => {
            // console.info(res);
            return res.data;
        })
        .then(res => {
            const text = pako.inflate(res, { to: 'string' });
            const resultobj = JSON.parse(text);

            callback(resultobj);
        })
        .catch(res => {
            Message({ message: res, type: 'error', duration: 5000 })
                console.log('其他异常:', res);
        });
};

export default {
    getData,
    getServerData,
    getGzipData,
};