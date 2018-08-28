<template>
    <div class="qiye">
        <div class="top">
            
            <span>水列表</span>
        </div>
        <div class="bottom">
            <div class="box" v-for="(item,index) in addresslist" :key="index">
                <div class="up">
                    <!-- <p class="one" v-for="(item, index) in companylist" :key="'company' + index" >{{item}}</p> -->
                    <p class="one">{{item.name}}<span>Ⅱ</span></p>
                    
                    <p class="two">{{item.pai}}</p>
                </div>
                <div class="down">
                    <div class="ph fl"><p class="wu">{{item.ph}}</p><p class="zhi">{{item.phz}}</p></div>
                    <div class="rong fl"><p class="wu">{{item.rong}}</p><p class="zhi">{{item.rongz}}</p></div>
                    <div class="andan fl"><p class="wu">{{item.an}}</p><p class="zhi">{{item.anz}}</p></div>
                    <div class="meng fl"><p class="wu">{{item.meng}}</p><p class="zhi">{{item.mengz}}</p></div>
                    <p class="shu shu3"></p><p class="shu shu4"></p><p class="shu shu5"></p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import '@/assets/css/list.less'
export default {
    data(){
        return{
            addresslist:[
                {name:'浙江杭州鸠坑口',pai:'正常',ph:'PH',phz:'7.20',rong:'溶解氧',rongz:'7.90',an:'氨氮',anz:'0.30',meng:'高锰酸钾',mengz:'1.60'},
                {name:'浙江嘉兴斜路港',pai:'正常',ph:'PH',phz:'7.80',rong:'溶解氧',rongz:'6.90',an:'氨氮',anz:'0.30',meng:'高锰酸钾',mengz:'1.60'},
                {name:'浙江杭州鸠坑口',pai:'正常',ph:'PH',phz:'7.20',rong:'溶解氧',rongz:'7.90',an:'氨氮',anz:'0.30',meng:'高锰酸钾',mengz:'1.60'},
                {name:'浙江嘉兴斜路港',pai:'正常',ph:'PH',phz:'7.80',rong:'溶解氧',rongz:'6.90',an:'氨氮',anz:'0.30',meng:'高锰酸钾',mengz:'1.60'}
            ]
        };
    },
    mounted(){
    },
    methods:{
    }
    
}
</script>
<style scoped>
</style>
