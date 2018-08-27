/**
 * 转换日期对象为日期字符串
 * @param property 对象的某一属性
 * 根据对象的某一属性进行排序,须配合sort使用,示例:arr.sort(sortObj(property));从小到大
 * @return 返回按某一属性排序好的对象
 */
import { Base64, AES } from './crypto/';

// 表格排序
export function sortDatas(val, orderType, tableArr) {
    const datas = tableArr;

    if (datas.length > 0) {
        if (orderType === "ascending") {
            datas.sort((a, b) => {
                return a[val] - b[val];
            });
        } else if (orderType === "descending") {
            datas.sort((a, b) => {
                return b[val] - a[val];
            });
        }
        let index = 1;
        let value = datas[0][val];
        if (val.indexOf('ratio') > -1) {
            value = Math.abs(parseFloat(datas[0][val] * 100).toFixed(1));
        }
        let sortArr = [];
        for (let i = 0; i < datas.length; i++) {
            if (val.indexOf('ratio') > -1) {
                if (Math.abs(parseFloat(datas[i][val] * 100).toFixed(1)) != value) {
                    index = i + 1;
                }
                value = Math.abs(parseFloat(datas[i][val] * 100).toFixed(1));
            } else {
                if (datas[i][val] !== value) {
                    index = i + 1;
                }
                value = datas[i][val];
            }
            sortArr.push(index);
        }
        return sortArr;
        //   console.log(sortArr);
    }
}
export function sortObj(property, type) {
    return (a, b) => {
        const value1 = a[property];
        const value2 = b[property];
        if (type === 'DESC') {
            return value2 - value1;
        }
        return value1 - value2;
    };
}

export function sortObjString(property, type) {
    return (a, b) => {
        const value1 = a[property];
        const value2 = b[property];
        if (type === 'DESC') {
            return value2 < value1;
        }
        return value1 < value2;
    };
}

export function returnAQIColor(aqi) {
    let color = '';
    if (aqi <= 0) {
        color = '#f0f0f0';
    } else if (aqi <= 50) {
        color = '#43ce17';
    } else if (aqi <= 100) {
        color = '#efdc31';
    } else if (aqi <= 150) {
        color = '#fa0';
    } else if (aqi <= 200) {
        color = '#ff401a';
    } else if (aqi <= 300) {
        color = '#d20040';
    } else {
        color = '#9c0a4e';
    }
    return color;
}
/*
 * 根据aqi得到污染等级
 */
export function getAQIlevel(aqi) {
    let color = '';
    if (aqi <= 0) {
        color = '无';
    } else if (aqi <= 50) {
        color = '优';
    } else if (aqi <= 100) {
        color = '良';
    } else if (aqi <= 150) {
        color = '轻度污染';
    } else if (aqi <= 200) {
        color = '中度污染';
    } else if (aqi <= 300) {
        color = '重度污染';
    } else {
        color = '严重污染';
    }
    return color;
}
export function getWindDirectionStr(wd) {
    let wdstr = '-';
    if (wd == null) {
        wdstr = '-';
    } else if (wd <= 22.5 || wd >= 337.5) {
        wdstr = '北风';
    } else if (wd > 22.5 && wd <= 67.5) {
        wdstr = '东北风';
    } else if (wd > 67.5 && wd <= 112.5) {
        wdstr = '东风';
    } else if (wd > 112.5 && wd <= 157.5) {
        wdstr = '东南风';
    } else if (wd > 157.5 && wd <= 202.5) {
        wdstr = '南风';
    } else if (wd > 202.5 && wd <= 247.5) {
        wdstr = '西南风';
    } else if (wd > 247.5 && wd <= 292.5) {
        wdstr = '西风';
    } else if (wd > 292.5 && wd <= 337.5) {
        wdstr = '西北风';
    }
    return wdstr;
}
/*
 * 根据AQI获取污染等级
 */
function getAQILevelIndex(aqi) {
    let level = 0;
    if (aqi <= 0) {
        level = 0;
    } else if (aqi <= 50) {
        level = 1;
    } else if (aqi <= 100) {
        level = 2;
    } else if (aqi <= 150) {
        level = 3;
    } else if (aqi <= 200) {
        level = 4;
    } else if (aqi <= 300) {
        level = 5;
    } else {
        level = 6;
    }
    return level;
}

/*
 * 根据等级获取颜色
 */
export function getColorByIndex(level) {
    let color = '#BEBEBE';
    if (level === 0) {
        color = '#BEBEBE';
    } else if (level === 1) {
        color = '#43ce17';
    } else if (level === 2) {
        color = '#efdc31';
    } else if (level === 3) {
        color = '#fa0';
    } else if (level === 4) {
        color = '#ff401a';
    } else if (level === 5) {
        color = '#d20040';
    } else if (level === 6) {
        color = '#9c0a4e';
    } else {
        color = 'rgb(98, 132, 170)';
    }
    return color;
}

/*
 * 根据综合指数得到对应污染等级
 */
function getComplexIndexLevelIndex(complexindex) {
    let level = 0;
    if (complexindex <= 5) {
        level = 1;
    } else if (complexindex <= 6) {
        level = 2;
    } else if (complexindex <= 8) {
        level = 3;
    } else if (complexindex <= 9) {
        level = 4;
    } else if (complexindex <= 10) {
        level = 5;
    } else {
        level = 6;
    }
    return level;
}

/*
 * 根据pm2.5得到对应污染等级
 */
function getPM25LevelIndex(pm25) {
    let level;
    if (pm25 === 0) {
        level = 0;
    } else if (pm25 <= 35) {
        level = 1;
    } else if (pm25 <= 75) {
        level = 2;
    } else if (pm25 <= 115) {
        level = 3;
    } else if (pm25 <= 150) {
        level = 4;
    } else if (pm25 <= 250) {
        level = 5;
    } else {
        level = 6;
    }
    return level;
}

/*
 *根据pm10得到对应污染等级
 */
function getPM10LevelIndex(pm10) {
    let level;
    if (pm10 === 0) {
        level = 0;
    } else if (pm10 <= 50) {
        level = 1;
    } else if (pm10 <= 150) {
        level = 2;
    } else if (pm10 <= 250) {
        level = 3;
    } else if (pm10 <= 350) {
        level = 4;
    } else if (pm10 <= 420) {
        level = 5;
    } else {
        level = 6;
    }
    return level;
}

/**
 *根据so2得到对应污染等级 ,根据日计算的标准
 */
function getSO2LevelIndex(so2) {
    let level;
    if (so2 === 0) {
        level = 0;
    } else if (so2 <= 50) {
        level = 1;
    } else if (so2 <= 150) {
        level = 2;
    } else if (so2 <= 475) {
        level = 3;
    } else if (so2 <= 800) {
        level = 4;
    } else {
        level = 5;
    }
    return level;
}

/**
 *根据no2得到对应污染等级
 */
function getNO2LevelIndex(no2) {
    let level;
    if (no2 === 0) {
        level = 0;
    } else if (no2 <= 40) {
        level = 1;
    } else if (no2 <= 80) {
        level = 2;
    } else if (no2 <= 180) {
        level = 3;
    } else if (no2 <= 280) {
        level = 4;
    } else if (no2 <= 565) {
        level = 5;
    } else {
        level = 6;
    }
    return level;
}

/**
 * 根据o3得到对应污染等级
 */
// function getO3LevelIndex(o3) {
//   let level;
//   if (o3 === 0) {
//     level = 0;
//   } else if (o3 <= 100) {
//     level = 1;
//   } else if (o3 <= 160) {
//     level = 2;
//   } else if (o3 <= 215) {
//     level = 3;
//   } else if (o3 <= 265) {
//     level = 4;
//   } else if (o3 <= 800) {
//     level = 5;
//   } else {
//     level = 6;
//   }
//   return level;
// }
function getO3LevelIndex(o3, type) {
    let level;
    if (type === 'day') {
        if (o3 === 0 || o3 === null || typeof o3 === 'undefined') {
            level = 0;
        } else if (o3 <= 100) {
            level = 1;
        } else if (o3 <= 160) {
            level = 2;
        } else if (o3 <= 215) {
            level = 3;
        } else if (o3 <= 265) {
            level = 4;
        } else if (o3 <= 800) {
            level = 5;
        } else {
            level = 6;
        }
    } else if (type !== 'day') {
        if (o3 === 0 || o3 === null || typeof o3 === 'undefined') {
            level = 0;
        } else if (o3 <= 160) {
            level = 1;
        } else if (o3 <= 200) {
            level = 2;
        } else if (o3 <= 300) {
            level = 3;
        } else if (o3 <= 400) {
            level = 4;
        } else if (o3 <= 800) {
            level = 5;
        } else {
            level = 6;
        }
    }
    return level;
}
/**
 * 根据co得到对应污染等级
 */
function getCOLevelIndex(co) {
    let level;
    if (co === 0) {
        level = 0;
    } else if (co <= 2) {
        level = 1;
    } else if (co <= 4) {
        level = 2;
    } else if (co <= 14) {
        level = 3;
    } else if (co <= 24) {
        level = 4;
    } else if (co <= 36) {
        level = 5;
    } else {
        level = 6;
    }
    return level;
}

export function getIndexByPollName(val, type) {
    let level = 0;
    switch (type) {
        case 'so2':
            level = getSO2LevelIndex(val);
            break;
        case 'no2':
            level = getNO2LevelIndex(val);
            break;
        case 'co':
            level = getCOLevelIndex(val);
            break;
        case 'o3':
            level = getO3LevelIndex(val);
            break;
        case 'o3_8h':
            level = getO3LevelIndex(val);
            break;
        case 'pm2_5':
            level = getPM25LevelIndex(val);
            break;
        case 'pm10':
            level = getPM10LevelIndex(val);
            break;
        case 'aqi':
            level = getAQILevelIndex(val);
            break;
        case 'complexindex':
            level = getComplexIndexLevelIndex(val);
            break;
        case 'temp':
            level = getTempIndex(val);
            break;
        case 'humi':
            level = getHumiIndex(val);
            break;
        case 'wl':
            level = getWindLevelIndex(val);
            break;
        default:
            level = 7;
    }
    return level;
}

// 根据浓度获取颜色
export function returnColorByPollName(val, type) {
    const level = getIndexByPollName(val, type);
    return getColorByIndex(level);
}

export function returnStyleByPollName(val, type) {
    const level = getIndexByPollName(val, type);
    const bgcolor = getColorByIndex(level);
    const color = level <= 3 ? 'black' : 'white';
    const style = `background:${bgcolor};color:${color}`;
    return style;
}

export function returnStyleObjByPollName(val, type) {
    const level = getIndexByPollName(val, type);
    const bgcolor = getColorByIndex(level);
    const color = level <= 3 ? 'black' : 'white';
    const obj = {};
    obj.bgcolor = bgcolor;
    obj.color = color;
    return obj;
}


/*
 // 作者 Jie Wang
 // 参数：
 // startColor：开始颜色hex
 // endColor：结束颜色hex
 // step:几个阶级（几步）
*/
export function gradientColor(startColor, endColor, step) {
    const startRGB = this.colorRgb(startColor); // 转换为rgb数组模式
    const startR = startRGB[0];
    const startG = startRGB[1];
    const startB = startRGB[2];

    const endRGB = this.colorRgb(endColor);
    const endR = endRGB[0];
    const endG = endRGB[1];
    const endB = endRGB[2];

    const sR = (endR - startR) / step; // 总差值
    const sG = (endG - startG) / step;
    const sB = (endB - startB) / step;

    const colorArr = [];
    for (let i = 0; i < step; i++) {
        // 计算每一步的hex值
        // eslint-disable-next-line radix
        const hex = this.colorHex('rgb(' + parseInt(((sR * i) + startR)) + ',' + parseInt(((sG * i) + startG)) + ',' + parseInt(((sB * i) + startB)) + ')');
        colorArr.push(hex);
    }
    return colorArr;
}
// 将rgb表示方式转换为hex表示方式
// eslint-disable-next-line consistent-return
gradientColor.prototype.colorHex = function(rgb) {
    const _this = rgb;
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    if (/^(rgb|RGB)/.test(_this)) {
        const aColor = _this.replace(/(?:(|)|rgb|RGB)*/g, '').split(',');
        let strHex = '#';
        for (let i = 0; i < aColor.length; i++) {
            let hex = Number(aColor[i]).toString(16);
            hex = hex < 10 ? 0 + '' + hex : hex; // 保证每个rgb的值为2位
            if (hex === '0') {
                hex += hex;
            }
            strHex += hex;
        }
        if (strHex.length !== 7) {
            strHex = _this;
        }
        return strHex;
    } else if (reg.test(_this)) {
        const aNum = _this.replace(/#/, '').split('');
        if (aNum.length === 6) {
            return _this;
        } else if (aNum.length === 3) {
            let numHex = '#';
            for (let i = 0; i < aNum.length; i += 1) {
                numHex += (aNum[i] + aNum[i]);
            }
            return numHex;
        }
    } else {
        return _this;
    }
};
// 将hex表示方式转换为rgb表示方式(这里返回rgb数组模式)
gradientColor.prototype.colorRgb = function(sColor) {
    const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    sColor = sColor.toLowerCase();
    if (sColor && reg.test(sColor)) {
        if (sColor.length === 4) {
            let sColorNew = '#';
            for (let i = 1; i < 4; i += 1) {
                sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
            }
            sColor = sColorNew;
        }
        // 处理六位的颜色值
        const sColorChange = [];
        for (let i = 1; i < 7; i += 2) {
            // eslint-disable-next-line radix
            sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)));
        }
        return sColorChange;
    }
    return sColor;
};
/*
 * 根据变化率颜色变化
 */
export function getGradientColorByRatio(ratio) {
    const colorbar = ['#43ce17', '#efdc31', '#fa0', '#ff401a', '#d20040', '#9c0a4e'];
    // eslint-disable-next-line one-var
    let color,
        bgcolor,
        gradient;
    // eslint-disable-next-line radix
    ratio = parseInt(ratio);
    if (ratio < -30) {
        bgcolor = colorbar[0];
        color = 'black';
    } else if (ratio < 0) {
        gradient = new gradientColor(colorbar[0], colorbar[1], 30);
        bgcolor = gradient[ratio + 30];
        color = 'black';
    } else if (ratio < 10) {
        gradient = new gradientColor(colorbar[1], colorbar[2], 10);
        bgcolor = gradient[ratio];
        color = 'black';
    } else if (ratio < 20) {
        gradient = new gradientColor(colorbar[2], colorbar[3], 10);
        bgcolor = gradient[ratio - 10];
        color = 'black';
    } else if (ratio < 30) {
        gradient = new gradientColor(colorbar[3], colorbar[4], 10);
        bgcolor = gradient[ratio - 20];
        color = 'white';
    } else if (ratio < 40) {
        gradient = new gradientColor(colorbar[4], colorbar[5], 10);
        bgcolor = gradient[ratio - 30];
        color = 'white';
    } else {
        bgcolor = colorbar[5];
        color = 'white';
    }
    let style = {};
    style = { background: bgcolor, color };
    return style;
}

export function GradientColorByCoef(coef) {
    const color1 = '#0000FF';
    const color2 = '#00BFFF';
    const color3 = '#00FF00';
    const color4 = '#FFFF00';
    const color5 = '#FF0000';
    const gradient1 = new gradientColor(color1, color2, 50);
    const gradient2 = new gradientColor(color2, color3, 50);
    const gradient3 = new gradientColor(color3, color4, 50);
    const gradient4 = new gradientColor(color4, color5, 50);
    coef = parseInt(coef * 100, 10);
    let color;
    let bgcolor;

    color = 'black';
    if (coef <= -50) {
        bgcolor = gradient1[coef + 100 - 1];
        if (coef <= -50) {
            color = 'white';
        }
    } else if (coef <= 0) {
        bgcolor = gradient2[coef + 50 - 1];
        color = 'black';
    } else if (coef <= 50) {
        bgcolor = gradient3[coef - 1];
        color = 'black';
    } else if (coef <= 100) {
        bgcolor = gradient4[coef - 50 - 1];
        if (coef >= 70) {
            color = 'white';
        }
    }
    const result = {};
    result.bgcolor = bgcolor;
    result.color = color;
    return result;
}

// 为了生成上传到七牛的图片
function dataURItoBlob(base64Data) {
    let byteString;
    if (base64Data.split(',')[0].indexOf('base64') >= 0) { byteString = atob(base64Data.split(',')[1]); } else { byteString = unescape(base64Data.split(',')[1]); }
    const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], { type: mimeString });
}

export function getvolorbycv(val) {
    let color = '';
    if (val <= -20) {
        color = '#29F63F';
    } else if (val <= -15) {
        color = '#55F730';
    } else if (val <= -10) {
        color = '#85F730';
    } else if (val <= -5) {
        color = '#B5F731';
    } else if (val <= 0) {
        color = '#E7F933';
    } else if (val <= 5) {
        color = '#FEE332';
    } else if (val <= 10) {
        color = '#FEB229';
    } else if (val <= 15) {
        color = '#FF7520';
    } else if (val <= 20) {
        color = '#FE3E19';
    } else if (val > 20) {
        color = '#d3000f';
    }
    return color;
}

export function getcolorbyamt(val) {
    if (val === 0) {
        return '#3AD000';
    } else if (val <= 3) {
        return '#F0DE02';
    } else if (val <= 6) {
        return '#F2CC02';
    } else if (val <= 9) {
        return '#F3BA02';
    } else if (val <= 12) {
        return '#F5A802';
    } else if (val <= 15) {
        return '#F69602';
    } else if (val <= 18) {
        return '#F88402';
    } else if (val <= 21) {
        return '#F97202';
    } else if (val <= 24) {
        return '#FB6002';
    } else if (val <= 27) {
        return '#FC4E02';
    } else if (val <= 30) {
        return '#FF3E00';
    }
    return 'red';
}

export function getcolorbybfb(val) {
    if (val >= 100) {
        return '#3AD000';
    } else if (val >= 90) {
        return '#50D102';
    } else if (val >= 80) {
        return '#64D202';
    } else if (val >= 70) {
        return '#64D202';
    } else if (val >= 60) {
        return '#78D402';
    } else if (val >= 50) {
        return '#8CD502';
    } else if (val >= 40) {
        return '#A0D702';
    } else if (val >= 30) {
        return '#B4D802';
    } else if (val >= 20) {
        return '#C8DB02';
    } else if (val >= 10) {
        return '#DCDD02';
    }
    return '#F0DE02';
}

export function getcolorbybfbval(val) {
    if (val >= 33) {
        return '#3AD000';
    } else if (val >= 30) {
        return '#50D102';
    } else if (val >= 27) {
        return '#64D202';
    } else if (val >= 24) {
        return '#64D202';
    } else if (val >= 21) {
        return '#78D402';
    } else if (val >= 18) {
        return '#8CD502';
    } else if (val >= 15) {
        return '#A0D702';
    } else if (val >= 12) {
        return '#B4D802';
    } else if (val >= 9) {
        return '#C8DB02';
    } else if (val >= 6) {
        return '#DCDD02';
    }
    return '#F0DE02';
}

// 根据aqi得到对应颜色
export function getAQIColor(aqi) {
    let bgcolor = '';
    if (aqi <= 0) {
        bgcolor = '#6E6E6E';
    } else if (aqi <= 50) {
        bgcolor = '#43ce17';
    } else if (aqi <= 100) {
        bgcolor = '#efdc31';
    } else if (aqi <= 150) {
        bgcolor = '#fa0';
    } else if (aqi <= 200) {
        bgcolor = '#ff401a';
    } else if (aqi <= 300) {
        bgcolor = '#d20040';
    } else {
        bgcolor = '#9c0a4e';
    }
    const color = aqi <= 150 ? 'black' : 'white';
    const obj = {};
    obj.bgcolor = bgcolor;
    obj.color = color;
    return obj;
}

/*
 * 根据aqi得到简写污染等级
 */
export function getAQIJianlevel(aqi) {
    let color = '';
    if (aqi <= 0) {
        color = '无';
    } else if (aqi <= 50) {
        color = '优';
    } else if (aqi <= 100) {
        color = '良';
    } else if (aqi <= 150) {
        color = '轻度';
    } else if (aqi <= 200) {
        color = '中度';
    } else if (aqi <= 300) {
        color = '重度';
    } else {
        color = '严重';
    }
    return color;
}

export function isString(text) {
    console.log(text);
    return (typeof text === 'string' && text.constructor === String);
}

/*
 * 位数不够，自动补0
 */
export function prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
}
// 根据氮氧化物、二氧化硫，烟尘获取颜色值
export function getColorStrength(flag) {
    let color;
    if (flag === 0) {
        color = '#43CE17';
    } else if (flag === 1) {
        color = '#9C0A4E';
    }
    return color;
}

/*
 * 根据风速获取风级
 */
export function getWindLevel(windspeed) {
    let windlevel = 0;
    if (windspeed < 1) {
        windlevel = 0;
    } else if (windspeed <= 5) {
        windlevel = 1;
    } else if (windspeed <= 11) {
        windlevel = 2;
    } else if (windspeed <= 19) {
        windlevel = 3;
    } else if (windspeed <= 28) {
        windlevel = 4;
    } else if (windspeed <= 38) {
        windlevel = 5;
    } else if (windspeed <= 49) {
        windlevel = 6;
    } else if (windspeed <= 61) {
        windlevel = 7;
    } else if (windspeed <= 74) {
        windlevel = 8;
    } else if (windspeed <= 88) {
        windlevel = 9;
    } else if (windspeed <= 102) {
        windlevel = 10;
    } else if (windspeed <= 117) {
        windlevel = 11;
    } else if (windspeed <= 133) {
        windlevel = 12;
    } else if (windspeed <= 149) {
        windlevel = 13;
    } else if (windspeed <= 166) {
        windlevel = 14;
    } else if (windspeed <= 183) {
        windlevel = 15;
    } else if (windspeed <= 201) {
        windlevel = 16;
    } else if (windspeed <= 220) {
        windlevel = 17;
    } else if (windspeed === undefined) {
        windlevel = '-';
    }
    return windlevel;
}

export function getBDLatlngByGPS(lat, lng) {
    const x_PI = 3.14159265358979324 * 3000.0 / 180.0;
    const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * x_PI);
    const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * x_PI);
    const bd_lng = z * Math.cos(theta) + 0.0065;
    const bd_lat = z * Math.sin(theta) + 0.006;
    return {
        lng: bd_lng,
        lat: bd_lat
    };
}

export function roundFourInSix(num, precision = 0) {
    const numstr = num + '';
    const point = numstr.indexOf('.'); // 小数点出现的位置
    if (point === -1) { // 如果没有小数点,直接返回
        return num;
    }
    if (numstr.substr(numstr.indexOf('.') + 1).length <= precision) {
        return num;
    }
    const front = numstr.substr(0, point + precision); // 前半部分
    const frontnum = numstr.substr(point + precision, 1); // 前一个数字
    const keynum = numstr.substr(point + precision + 1, 1); // 关键位数字
    const lastnum = numstr.substr(point + precision + 2); // 关键位数字
    let b = parseFloat(frontnum);
    let neednum;
    if (precision === 0) {
        let a = parseFloat(front);
        if (parseInt(keynum, 10) >= 6) { // 进位
            a++;
        } else if (parseInt(keynum, 10) === 5 && lastnum !== '' && parseInt(lastnum, 10) !== 0) {
            a++;
        } else if (parseInt(keynum, 10) === 5 && b % 2 !== 0) {
            a++;
        }
        neednum = a;
    } else if (precision !== 0 && parseInt(keynum, 10) >= 6) {
        b++;
        neednum = parseFloat((parseFloat(front) + parseFloat(b) / Math.pow(10, precision)).toFixed(precision));
    } else if (precision !== 0 && parseInt(keynum, 10) === 5) {
        if (lastnum !== '' && parseInt(lastnum, 10) !== 0) {
            b++;
        } else if (b % 2 !== 0) { // 偶数
            b++;
        }
        neednum = parseFloat((parseFloat(front) + parseFloat(b) / Math.pow(10, precision)).toFixed(precision));
    } else if (precision !== 0 && parseInt(keynum, 10) <= 4) {
        neednum = parseFloat((parseFloat(front) + parseFloat(b) / Math.pow(10, precision)).toFixed(precision));
    }
    return neednum;
}

export function getcomplexindex(pm2_5, pm10, so2, no2, co, o3) {
    return parseFloat(so2 / 60 + no2 / 40 + co / 4 + o3 / 160 + pm10 / 70 + pm2_5 / 35).toFixed(2);
}

export function returnThousandColorByPollName(value) {
    const num1 = 25;
    const num2 = 50;
    const num3 = 50;
    const num4 = 50;
    const num5 = 100;
    const num6 = 225;
    const styleobj1 = new gradientColor('#006000', '#42E800', num1);
    const styleobj2 = new gradientColor('#42E800', '#FEFF03', num2);
    const styleobj3 = new gradientColor('#FEFF03', '#F87F13', num3);
    const styleobj4 = new gradientColor('#F87F13', '#F60016', num4);
    const styleobj5 = new gradientColor('#F60016', '#96004D', num5);
    const styleobj6 = new gradientColor('#96004D', '#7B0023', num6);
    const styleobjSUM = ['rgb(160,160,160)', ...styleobj1, ...styleobj2, ...styleobj3, ...styleobj4, ...styleobj5, ...styleobj6];
    return styleobjSUM[value];
}

export function mul(num, arg) {
    let m = 0;
    const s1 = num.toString();
    const s2 = arg.toString();
    if (s1.indexOf('.') >= 0) {
        m += s1.split('.')[1].length;
    }
    if (s2.indexOf('.') >= 0) {
        m += s2.split('.')[1].length;
    }
    return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m);
}

export function getTempIndex(temp) {
    var level = 0;
    if (temp <= 15) {
        level = 1;
    } else if (temp <= 20) {
        level = 2;
    } else if (temp <= 25) {
        level = 3;
    } else if (temp <= 30) {
        level = 4;
    } else if (temp <= 35) {
        level = 5;
    } else {
        level = 6;
    }
    return level;
}
export function getWindLevelIndex(value) {
    var level = 0;
    if (value == 0) {
        level = 0;
    } else if (value <= 2) {
        level = 1;
    } else if (value <= 4) {
        level = 2;
    } else if (value <= 6) {
        level = 3;
    } else if (value <= 8) {
        level = 4;
    } else if (value <= 10) {
        level = 5;
    } else {
        level = 6;
    }
    return level;
}
export function getHumiIndex(humi) {
    var level = 0;
    if (humi == 0) {
        level = 0;
    } else if (humi <= 20) {
        level = 1;
    } else if (humi <= 40) {
        level = 2;
    } else if (humi <= 60) {
        level = 3;
    } else if (humi <= 80) {
        level = 4;
    } else if (humi <= 100) {
        level = 5;
    }
    return level;
}
/*获取风向图标*/
export function getWindDirectionIcon(wd) {
    var wid = 0;
    var url = null;
    switch (wd) {
        case '东风':
            wid = 1;
            break;
        case '静风':
            wid = 1;
            break;
        case '东南风':
            wid = 2;
            break;
        case '南风':
            wid = 3;
            break;
        case '西南风':
            wid = 4;
            break;
        case '西风':
            wid = 5;
            break;
        case '西北风':
            wid = 6;
            break;
        case '北风':
            wid = 7;
            break;
        case '东北风':
            wid = 8;
            break;
    }
    if (wid > 0) {
        url = 'http://m.zq12369.com/resource/img/wind/' + wid + '.png';
    }
    return url;
}
/*
 * 根据水等级获取颜色
 */
export function getColorByWater(level) {
    let color = '#BEBEBE'; //I  II  III  IV  V  劣V
    if (level === '--') {
        color = '#BEBEBE';
    } else if (level === 'I') {
        color = '#43ce17';
    } else if (level === 'II') {
        color = '#efdc31';
    } else if (level === 'III') {
        color = '#fa0';
    } else if (level === 'IV') {
        color = '#ff401a';
    } else if (level === 'V') {
        color = '#d20040';
    } else if (level === '劣V') {
        color = '#9c0a4e';
    } else {
        color = 'rgb(98, 132, 170)';
    }
    return color;
}
export function getstyleByWater(level) {
    let style = '#BEBEBE'; //I  II  III  IV  V  劣V
    if (level === '--') {
        style = 'background:#BEBEBE;color:black';
    } else if (level === 'I') {
        style = 'background:#cafcff;color:black';
    } else if (level === 'II') {
        style = 'background:#36c3f9;color:black';
    } else if (level === 'III') {
        style = 'background:#17fa13;color:black';
    } else if (level === 'IV') {
        style = 'background:#f7fc19;color:black';
    } else if (level === 'V') {
        style = 'background:#ff9000;color:black';
    } else if (level === '劣V') {
        style = 'background:#f62c2a;color:white';
    } else {
        style = 'background:#43ce17;color:black';
    }
    return style;
}
export function getUrlKey(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null;
}

export default {
    sortObj,
    getUrlKey,
    returnAQIColor,
    getAQIlevel,
    getWindDirectionStr,
    getWindLevelIndex,
    getHumiIndex,
    getTempIndex,
    getIndexByPollName,
    getColorByIndex,
    returnColorByPollName,
    returnStyleByPollName,
    returnStyleObjByPollName,
    getGradientColorByRatio,
    getvolorbycv,
    getcolorbyamt,
    getcolorbybfb,
    getcolorbybfbval,
    GradientColorByCoef,
    getcomplexindex,
    isString,
    getAQIColor,
    getAQIJianlevel,
    prefixInteger,
    getColorStrength,
    getWindLevel,
    getBDLatlngByGPS,
    roundFourInSix,
    mul,
    getColorByWater,
    getstyleByWater,
    returnThousandColorByPollName,
    sortDatas,
    getAQILevelIndex
};