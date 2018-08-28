import Vue from 'vue'
import Router from 'vue-router'
import appMap from '@/views/appMap/appmap'
import index from '@/views/index'
import rank from '@/views/rank/rank'
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
    },
    {
        path: '/provinceRank',
        name: 'provinceRank',
        component: provinceRank
    }]
})