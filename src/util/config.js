const url = {
    global: {},
    dataapi: {
        url: 'dataapi',
        method: {
            getdata: 'DATAAPI_GETDATA',
            getappwatermap: 'DATAAPI_GETAPPWATERMAP',
            getpalm3home: 'DATAAPI_GETPALM3HOME',
            getbasedata: 'DATAAPI_GETBASEDATA',
            getmap: 'DATAAPI_GETMAP',
            calendar: 'DATAAPI_GETDAYDATA',
            getAllProvin: 'DATAAPI_GETPROVINCES',
            getAllCity: 'DATAAPI_GETCITYSBYPROVINCE',
            getPointsBycity: 'DATAAPI_GETPOINTSBYCITY', // 根据城市获取所有的站
            getRegionBycity: 'DATAAPI_GETREGIONSBYCITY', // 根据城市获取所有的区域
            getCache: 'DATAAPI_GETCACHES', // 获取所有缓存列表
            removeCache: 'DATAAPI_REMOVECACHE', // 清除指定缓存
            clearCache: 'DATAAPI_CLEARCACHE',
            getcityrank: 'DATAAPI_GETCITYRANK',
            getprovacecity: 'DATAAPI_GETPROVINCEINNERDATA',
            getpointcompare: 'DATAAPI_GETPOINTCOMPARE',
            getcitycompare: 'DATAAPI_GETCITYCOMPARE',
            gethourstatistics: 'DATAAPI_GETHOURSTATISTICS', // 整点统计
            getpointdata: 'DATAAPI_GETPOINTDATA',
            getalltimetypedata: 'DATAAPI_GETCITYALLRANK',
            getdataapigetandard: 'DATAAPI_GETSTANDARD', // 达标分析
            getcityairweatherdata: 'DATAAPI_GETCITYAIRWEATHERDATA', // 关联挖掘
            getcitylist: 'DATAAPI_GETCITYLIST',
            updateconcernedcity: 'DATAAPI_UPDATECONCERNEDCITY',
            getexaminetitledata: 'DATAAPI_TARGETASSESSMENT',
            getpollutionsituation: 'DATAAPI_GETPOLLUTIONSITUATION',
            getforeweathrtext: 'DATAAPI_GETFOREWEATHERTEXT', // 天气分析
            // getratiodata: 'DATAAPI_GETRATIO',
            getratiodata: 'DATAAPI_GETRATIOBYGIVENTIME',
            getdaydata: 'DATAAPI_GETDAYDATA', // 污染日历
            getdailydata: 'DATAAPI_GETDAILYDATA', // 郑州首页污染日历
            getaroundratiodata: 'DATAAPI_GETCITYSEQUENTIAL',
            getmcdata: 'DATAAPI_GETMCDATA',
            getbeforeafterrank: 'DATAAPI_GETYEARBEFOREANDAFTERRANK',
            getmonthratio: 'DATAAPI_GETMONTHVARIATIONTREND',
            getcityhistorydata: 'DATAAPI_GETCITYHISTORYDATA', // 国控点24小时曲线图
            getfairsensecurve: 'DATAAPI_GETFAIRSENSECURVE',
            getfairsensetable: 'DATAAPI_GETFAIRSENSETABLE',
            getfairsense: 'DATAAPI_GETFAIRSENSE',
            getwinterdata: 'DATAAPI_GETCITYPM25QUALITY',
            getoperationmapdata: 'DATAAPI_OPERATIONALMAP',
            getyearpm2_5days: 'DATAAPI_GETYEARPM25DAYS',
            getoperationhistorydata: 'DATAAPI_OPERATIONALMAPHISTORY',
            getratiobygiventime: 'DATAAPI_GETRATIOBYGIVENTIME',
            getprovinceratio: 'DATAAPI_GETDAYMONTHYEARRATIO',
            getpointcumulative: 'DATAAPI_GETPOINTCUMULATIVE',
            getcityprojectchart: 'DATAAPI_GETCITYPROJECTCHART',
            getnewexaminedata: 'DATAAPI_GETCITYWINTERANTITARGET',
            getregiondata: 'DATAAPI_GETREGIONRATIOCONTAINDMY',
            getregionseasondata: 'DATAAPI_GETREGIONSEASONDATA',
            getprovinceassessment: 'DATAAPI_GETPROVINCEASSESSMENT',
            getexaminedata: 'DATAAPI_GETTASKASSESSMENT',
            getmapdata: 'DATAAPI_OPERATIONALMAP',
            gethistorycumulativedata: 'DATAAPI_GETHISTORYCUMULATIVEDATA',
            getcumulativedata: 'DATAAPI_GETCUMULATIVEDATA', // 获取累计AQI
            gethourweather: 'DATAAPI_GET24HOURWEATHER', // 24小时天气预报
            geto3orcodata: 'DATAAPI_GETO3ORCODATA', // 百分位对比
            getsourceanalysis: 'DATAAPI_GETSOURCEANALYSIS',
            gettargetdecomposition: 'DATAAPI_GETTARGETDECOMPOSITION',
            gettargetdecompositiontable: 'DATAAPI_GETTARGETDECOMPOSITIONTABLE',
            getquantitativeassessment: 'DATAPI_GETQUANTITATIVEASSESSMENT',
            getaqiandrate: 'DATAAPI_GETAQIANDRATE',
            gethourcontrol: 'DATAAPI_HOURCONTROL', // 小时控制
            getcomplexandratio: 'DATAAPI_GETCOMPLEXANDRATIO',
            getsourcemonth: 'DATAAPI_GETSOURCEMONTH',
            gethourdata: 'DATAAPI_GETHOURDATA',
            getaqiandpm: 'DATAAPI_GETAQIANDPM',
            getlocksource: 'DATAAPI_GETLOCKSOURCE', // 重点督查锁源
            getqualityandratio: 'DATAAPI_GETQUALITYANDRATIO',
            getcomplexrank: 'DATAAPI_GETCOMPLEXRANK',
            getratioandquality: 'DATAAPI_GETRATIOANDQUALITY',
            getcityhourstatistics: 'DATAAPI_GETCITYHOURSTATISTICS', // 城市整点均值比
            gettvocpointdata: 'DATAAPI_GETTVOCPOINTDATA',
            gettvocpointlist: 'DATAAPI_GETTVOCPOINTLIST',
            getnewtvocdata: 'DATAAPI_GETNEWTVOCDATA',
            getexcellentrank: 'DATAAPI_GETEXCELLENTRANK',
        }
    },
    constructionapi: {
        url: 'constructionapi',
        method: {
            getdustcontrol: 'CONSTRUCTIONAPI_GETDUSTCONTROL',
            getcarcontrol: 'CONSTRUCTIONAPI_GETCARCONTROL',
            getenterpris: 'CONSTRUCTIONAPI_GETENTERPRISECONTROL',
            getsupervise: 'CONSTRUCTIONAPI_GETSUPERVICECONTROL',
            getcontroltitledata: 'CONSTRUCTIONAPI_GETINTELLIGENTCONTROL',
            getyearconstructionrank: 'CONSTRUCTIONAPI_GETENTERPRISECONTROLFLOW',
            getmuckcarlist: 'CONSTRUCTIONAPI_GETMUCKCARINFO',
            getenterprisenew: 'CONSTRUCTIONAPI_GETENTERPRISENEW', // 获取企业数据
            getsensordata: 'CONSTRUCTIONAPI_GETSENSORDATA', // 企业实时数据
            getoutputdata: 'CONSTRUCTIONAPI_GETOUTPUTDATA', // 企业排口信息
            getcarhotchartdata: 'CONSTRUCTIONAPI_GETMUCKCARDATA',
            searchmapinfo: 'CONSTRUCTIONAPI_SEARCHMAPINFO',
            setsensortype: 'CONSTRUCTIONAPI_GETSENSORTYPE', // 企业分类数据
            getdensortypehistory: 'CONSTRUCTIONAPI_GETSENSORTYPEHISTORY', // 企业分类时间接口(年、月、日)
            getsensortypecount: 'CONSTRUCTIONAPI_GETSENSORTYPECOUNT', // 企业阶段对比
            getcompanyhistorydatabyid: 'CONSTRUCTIONAPI_GETCOMPANYHISTORYDATABYID', // 企业24小时曲线图
            getenterpriseoutput: 'CONSTRUCTIONAPI_GETENTERPRISEOUTPUT',
            getshutoutput: 'CONSTRUCTIONAPI_GETSHUTOUTPUT',
        }
    },
    newsapi: {
        url: 'newsapi',
        method: {
            getnewslist: 'NEWSAPI_GETNEWSLIST',
            getpalmnewslist: 'NEWSAPI_GETPALMNEWSLIST',
            getpalmacrtsbytype: 'NEWSAPI_GETPALMACRTSBYTYPE',
        }
    },
    userapi: {
        url: 'userapi',
        method: {
            userlogin: 'USERAPI_LOGINFORPALM3',
            updatepassword: 'USERAPI_UPDATEPASSWORD',
        }
    },
    superviseapi: {
        url: 'superviseapi',
        method: {
            getsupervisestatistical: 'SUPERVISEAPI_GETSUPERVISESTATISTICAL',
            getpollutanttype: 'SUPERVISEAPI_GETPOLLUTANTTYPE', // 邢台网格获取污染类型
            getdepartement: 'SUPERVISEAPI_GETDEPARTMENT', // 邢台网格获取部门
            updatesupervisenew: 'SUPERVISEAPI_UPDATESUPERVISENEW', // 修改邢台网格
            getsupervisebyid: 'SUPERVISEAPI_GETSUPERVISEBYID', // 查询详情
            getuperviseflowsheet: 'SUPERVISEAPI_GETSUPERVISEFLOWSHEET', // 网格简易流程
            getcountuserdata: 'SUPERVISEAPI_GETSTATISTICALBYUSER',
            getcountuserdatabyuser: 'SUPERVISEAPI_GETSUPERVISEBYUSER',
            getcountpbdata: 'SUPERVISEAPI_GETSTATISTICALBYDEPT',
            getcountpbdatabydept: 'SUPERVISEAPI_GETSUPERVISEBYDEPT',
            getgridinfo: 'SUPERVISEAPI_GETGRIDINFO',
            getgriduserinfo: 'SUPERVISEAPI_GETGRIDUSERNEW',
            getconstructuonandscorebyregion: 'SUPERVISEAPI_GETCONSTRUCTIONANDSCOREBYREGION', // 工地信用评分
            getsupervisecountbytime: 'SUPERVISEAPI_GETSUPERVISECOUNTBYTIME',
            getsupervisecountdividemonth: 'SUPERVISEAPI_GETSUPERVISECOUNTDIVIDEMONTH',
            getinfobyconstructionid: 'SUPERVISEAPI_GETINFOBYCONSTRUCTIONID',
            getsuperviseconstructioninfoandhandles: 'SUPERVISEAPI_GETSUPERVISECONSTRUCTIONINFOANDHANDLES',
            getyesterdaysuperinfo: 'SUPERVISEAPI_GETDAILYSUPERVISEINFO',
            getdailycount: 'SUPERVISEAPI_GETDAILYCOUNT',
            getdailylist: 'SUPERVISEAPI_GETDAILYLIST',
        }
    },
    mapapi: {
        url: 'mapapi',
        method: {
            getcitylist: 'MAPAPI_GETCITYLISTMOBILE',
            gethistorydata: 'MAPAPI_GETHISTORY',
            getcitypointbylatlng: 'MAPAPI_GETCITYPOINTBYLATLNG',
            getcitydata: 'MAPAPI_GETFUTUREHISTORY',
        }
    },
    exportapi: {
        url: 'exportapi',
        method: {
            tvocdataexport: 'EXPORTAPI_TVOCDATAEXPORT',
        }
    }
};

const CommonConfig = {
    CommonParams: {
        appId: '4f0e3a273d547ce6b7147bfa7ceb4b6e', // 客户端编号
        clienttype: 'WEB',
    },
    imageHost: 'http://ogmy9qmgf.bkt.clouddn.com/image/',
};

const key = {
    // client param
    des_client_key: 'cGFsbWFwaWVuTQ==', // 16
    des_client_iv: 'cGFsbWRI', // 8

    // server result
    des_server_key: 'ZGVzcGFsbURCREVT',
    des_server_iv: 'RGRFU2Rl',

    aes_server_key: 'bWFwaWVuY29kZQ==', // 16
    aes_server_iv: 'EMNZCGFSBWFWAQ==', // 16

    // localstorage
    aes_local_key: 'emhlbnFpcGFsbWtleQ==',
    aes_local_iv: 'emhlbnFpcGFsbWl2',
};

// eslint-disable-next-line no-unused-vars
const ProductConfig = {
    isDev: false,
    host: '/api/',
    url,
    key,
    ...CommonConfig,
};

// eslint-disable-next-line no-unused-vars
const DevConfig = {
    isDev: true,
    host: window.location.host.indexOf('zq12369.com') > -1 ? '/api/' : 'http://palm3.zq12369.com/api/',
    windhost: window.location.host.indexOf('zq12369.com') > -1 ? '/data/' : 'http://palm3.zq12369.com/data/',
    url,
    key,
    ...CommonConfig,
};

export default DevConfig;
// export default ProductConfig;