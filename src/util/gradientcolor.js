 /*
     // 作者 Jie Wang
     // 参数：
     // startColor：开始颜色hex
     // endColor：结束颜色hex
     // step:几个阶级（几步）
   */
 export function gradientColarRGBA(startColor, endColor, step, opacity = 1) {
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
         // const hex = this.colorHex('rgba(' + parseInt(((sR * i) + startR)) + ',' + parseInt(((sG * i) + startG)) + ',' + parseInt(((sB * i) + startB)) + ',' + opacity + ')');
         const hex = [parseInt(((sR * i) + startR), 10), parseInt(((sG * i) + startG), 10), parseInt(((sB * i) + startB), 10), opacity];
         colorArr.push(hex);
     }
     return colorArr;
 }

 export function gradientColor(startColor, endColor, step, opacity = 1) {
     const colorArr = new gradientColarRGBA(startColor, endColor, step, opacity);
     const result = [];
     for (let i = 0; i < step; i++) {
         // 计算每一步的hex值
         // eslint-disable-next-line radix
         const hex = this.colorHex('rgba(' + colorArr[i][0] + ',' + colorArr[i][1] + ',' + colorArr[i][2] + ',' + opacity + ')');
         result.push(hex);
     }
     return result;
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
 gradientColarRGBA.prototype.colorRgb = function(sColor) {
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
         color = 'black';
     } else if (ratio < 40) {
         gradient = new gradientColor(colorbar[4], colorbar[5], 10);
         bgcolor = gradient[ratio - 30];
         color = 'black';
     } else {
         bgcolor = colorbar[5];
         color = 'black';
     }
     let style = {};
     style = { background: bgcolor, color };
     return style;
 }

 /*
  * 根据变化率颜色变化
  */
 export function getGradientColorByAqi(ratio) {
     const colorbar = ['#43ce17', '#efdc31', '#fa0', '#ff401a', '#d20040', '#9c0a4e'];
     // eslint-disable-next-line one-var
     let color,
         bgcolor,
         gradient;
     // eslint-disable-next-line radix
     ratio = parseInt(ratio);
     if (ratio < 20) {
         bgcolor = colorbar[0];
         color = 'black';
     } else if (ratio < 70) {
         gradient = new gradientColor(colorbar[0], colorbar[1], 50);
         bgcolor = gradient[ratio - 20];
         color = 'black';
     } else if (ratio < 120) {
         gradient = new gradientColor(colorbar[1], colorbar[2], 50);
         bgcolor = gradient[ratio - 70];
         color = 'black';
     } else if (ratio < 170) {
         gradient = new gradientColor(colorbar[2], colorbar[3], 50);
         bgcolor = gradient[ratio - 120];
         color = 'white';
     } else if (ratio < 220) {
         gradient = new gradientColor(colorbar[3], colorbar[4], 50);
         bgcolor = gradient[ratio - 170];
         color = 'white';
     } else if (ratio < 320) {
         gradient = new gradientColor(colorbar[4], colorbar[5], 100);
         bgcolor = gradient[ratio - 220];
         color = 'white';
     } else {
         bgcolor = colorbar[5];
         color = 'white';
     }
     let style = {};
     style = { background: bgcolor, color };
     return style;
 }

 export default {
     gradientColor,
     gradientColarRGBA,
     getGradientColorByRatio,
     getGradientColorByAqi
 };