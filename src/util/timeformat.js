// 扩展Date的format方法
export const timeformat = (date, format) => {
  const o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    'S': date.getMilliseconds()
  };
  let result = format;
  if (/(y+)/.test(result)) {
    result = result.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  Object.keys(o).forEach(k => {
    if (new RegExp('(' + k + ')').test(result)) {
      result = result.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    }
  });
  return result;
};

/**
* 转换日期对象为日期字符串
* @param date 日期
* @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
* @return 符合要求的日期字符串
*/
export const getFormatDate = (date, pattern) => {
  if (!date) {
    date = new Date();
  } else if (typeof date === 'string' && date.constructor === String) {
    date = date.replace(/-/g, '/');
    date = new Date(date);
  }
  if (!pattern) {
    pattern = 'yyyy-MM-dd hh:mm:ss';
  }
  return timeformat(date, pattern);
};

/**
* 转换日期对象为日期字符串
* @param date 日期对象
* @param isFull 是否为完整的日期数据,
*               为true时, 格式如"2000-03-05 01:05:04"
*               为false时, 格式如 "2000-03-05"
* @return 符合要求的日期字符串
*/
export const getSmpFormatDate = (date, isFull) => {
  let pattern = '';
  if (isFull === true || isFull === undefined) {
    pattern = 'yyyy-MM-dd hh:mm:ss';
  } else {
    pattern = 'yyyy-MM-dd';
  }
  return getFormatDate(date, pattern);
};

/**
* 转换当前日期对象为日期字符串
* @param date 日期对象
* @param isFull 是否为完整的日期数据,
*               为true时, 格式如"2000-03-05 01:05:04"
*               为false时, 格式如 "2000-03-05"
* @return 符合要求的日期字符串
*/
export const getSmpFormatNowDate = isFull => {
  return getSmpFormatDate(new Date(), isFull);
};

/**
* 转换当前日期对象为当前小时日期字符串
* @param date 日期对象
* @param isFull 是否为完整的日期数据,
*               为true时, 格式如"2000-03-05 01:05:04"
*               为false时, 格式如 "2000-03-05"
* @return 符合要求的日期字符串
*/
export const getSmpFormatNowHour = () => {
  return getSmpFormatDate(new Date(), true).substr(0, 13) + ':00:00';
};
/**
* 转换当前日期对象为当前小时日期字符串
* @param date 日期对象
* @param isFull 是否为完整的日期数据,
*               为true时, 格式如"2000-03-05 05:00"
*               为false时, 格式如 "2000-03-05"
* @return 符合要求的日期字符串
*/
export const getForFormatNowHour = () => {
  return getSmpFormatDate(new Date(), true).substr(0, 11) + (new Date().getHours()-1) +':00';
};

/**
* 转换当前日期对象为日期字符串
* @param date 日期对象
* @param isFull 是否为完整的日期数据,
*               为true时, 格式如"2000-03-05 01:05:04"
*               为false时, 格式如 "2000-03-05"
* @return 符合要求的日期字符串
*/
export const getPointTime = () => {
  const date = new Date();
  const minute = date.getMinutes();
  if (minute < 33) {
    date.setHours(date.getHours() - 1);
  }
  date.setMinutes(0);
  date.setSeconds(0);
  return getSmpFormatDate(date);
};

/**
* 转换long值为日期字符串
* @param l long值
* @param isFull 是否为完整的日期数据,
*               为true时, 格式如"2000-03-05 01:05:04"
*               为false时, 格式如 "2000-03-05"
* @return 符合要求的日期字符串
*/
export const getSmpFormatDateByLong = (l, isFull) => {
  return getSmpFormatDate(new Date(l), isFull);
};

/**
* 转换long值为日期字符串
* @param l long值
* @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
* @return 符合要求的日期字符串
*/
export const getFormatDateByLong = (l, pattern) => {
  return getFormatDate(new Date(l), pattern);
};

/**
* 转换日期字符串为long值
* @param datestr 日期字符串
* @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
* @return 日期整形
*/
export const getLongByDate = datestr => {
  if (!datestr) {
    return (new Date()).getTime();
  }
  datestr = datestr.replace(/-/g, '/');
  return (new Date(datestr)).getTime();
};


/**
* 转换日期字符串为日期类型
* @param datestr 日期字符串
* @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
* @return 日期整形
*/
export const getDateByStr = datestr => {
  if (!datestr) {
    return new Date();
  }
  datestr = datestr.replace(/-/g, '/');
  return (new Date(datestr));
};

/**
* 转换日期获取星期
* @param datestr 日期字符串
* @param pattern 格式字符串,例如：yyyy-MM-dd hh:mm:ss
* @return 日期整形
*/
export const getWeekByDate = datestr => {
  const weeks = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  let date;
  if (!datestr) {
    date = new Date();
  }
  datestr = datestr.replace(/-/g, '/');
  date = new Date(datestr);
  return weeks[date.getDay()];
};

/**
* 计算时间差
*/
export const calTimeDiff = (date1, date2) => {
  let date1value = date1.replace(/-/g, '/');
  date1value = (new Date(date1value)).getTime();

  let date2value;
  if (!date2) {
    date2value = (new Date()).getTime();
  } else {
    date2value = date2.replace(/-/g, '/');
    date2value = (new Date(date2value)).getTime();
  }
  return date2value - date1value;
};

/**
* 日期加减
*/
export const getFormatDateAdd = (date, num, pattern = 'yyyy-MM-dd hh:mm:ss') => {
  let newdate = date.replace(/-/g, '/');
  newdate = new Date(newdate);
  newdate.setDate(newdate.getDate() + num);
  return timeformat(newdate, pattern);
};

/**
 * 获取上一个月份日期
 */
export const getPreMonth = date => {
  const arr = date.split('-');
  const year = arr[0];
  const month = arr[1];
  const day = arr[2];
  let days = new Date(year, month, 0);
  days = days.getDate();
  let year2 = year;
  let month2 = parseInt(month, 10) - 1;
  if (month2 === 0) {
    year2 = parseInt(year2, 10) - 1;
    month2 = 12;
  }
  let day2 = day;
  let days2 = new Date(year2, month2, 0);
  days2 = days2.getDate();
  if (day2 > days2) {
    day2 = days2;
  }
  if (month2 < 10) {
    month2 = '0' + month2;
  }
  const t2 = year2 + '-' + month2 + '-' + day2;
  return t2;
};
/**
 * 获取当月天数
 */
export const getNowMonthDays = () => {
  const now_year = new Date().getFullYear();
  const now_month = new Date().getMonth() + 1;
  const day = new Date(now_year, now_month, 0);
  const daycount = day.getDate();
  return daycount;
};
/**
* 小时加减
*/
export const getFormatDateHourAdd = (date, num, pattern = 'yyyy-MM-dd hh:mm:ss') => {
  let newdate = date.replace(/-/g, '/');
  newdate = new Date(newdate);
  newdate.setHours(newdate.getHours() + num);
  return timeformat(newdate, pattern);
};

export const getWeekByDay = datestr => {
  const weeks = [7, 1, 2, 3, 4, 5, 6];
  let date;
  if (!datestr) {
    date = new Date();
  }
  datestr = datestr.replace(/-/g, '/');
  date = new Date(datestr);
  return weeks[date.getDay()];
};

export default {
  timeformat,
  getSmpFormatDate,
  getSmpFormatNowDate,
  getSmpFormatNowHour,
  getSmpFormatDateByLong,
  getFormatDateByLong,
  getFormatDate,
  getLongByDate,
  getDateByStr,
  getWeekByDate,
  getWeekByDay,
  calTimeDiff,
  getPointTime,
  getFormatDateAdd,
  getFormatDateHourAdd,
  getPreMonth,
  getNowMonthDays
};
