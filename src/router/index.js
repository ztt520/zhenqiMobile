import Vue from 'vue'
import Router from 'vue-router'
import appMap from '@/views/appMap/appmap'
import index from '@/views/index'
import rank from '@/views/rank/rank'
import water from '@/views/rank/water'
import qiye from '@/views/list/qiye'
import shui from '@/views/list/shui'
import pollute from '@/views/list/pollute'
import provinceRank from '@/views/rank/provinceRank'

Vue.use(Router)

export default new Router({
    routes: [{
        path: '/appMap',
        name: 'appMap',
        component: appMap
    },{
        path: '/',
        name: 'index',
        component: index
    },{
        path: '/rank',
        name: 'rank',
        component: rank
    },{
        path: '/water',
        name: 'water',
        component: water
    },{
        path: '/qiye',
        name: 'qiye',
        component: qiye
    },{
        path: '/shui',
        name: 'shui',
        component: shui
    },{
        path: '/pollute',
        name: 'pollute',
        component: pollute
    },
    {
        path: '/provinceRank',
        name: 'provinceRank',
        component: provinceRank
    }]
})