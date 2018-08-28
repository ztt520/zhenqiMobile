<template>
    <div class="qiye">
        <div class="top">
            <!-- <a><i class="el-icon-back"></i></a> -->
            <span>企业列表</span>
        </div>
        <div class="bottom">
            <div class="box" v-for="(item,index) in companylist" :key="index">
                <div class="up">
                    <!-- <p class="one" v-for="(item, index) in companylist" :key="'company' + index" >{{item}}</p> -->
                    <p class="one">{{item.name}}</p>
                    <p class="two">{{item.pai}}</p>
                </div>
                <div class="down">
                    <div class="first"><p class="wu">氮氧化物</p><p class="zhi">35.9/200</p></div>
                    <div class="second"><p class="wu">二氧化硫</p><p class="zhi">7.0/200</p></div>
                    <div class="third"><p class="wu">烟尘</p><p class="zhi">0.1/20</p></div>
                    <p class="shu shu1"></p><p class="shu shu2"></p>
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
            companylist:[
                {name:'杭州中策橡胶有限公司下沙基地',pai:'废气排放'},
                {name:'杭州中策橡胶有限公司下沙基地',pai:'废气排放'},
                {name:'杭州中策橡胶有限公司下沙基地',pai:'废气排放'},
                {name:'杭州中策橡胶有限公司下沙基地',pai:'废气排放'}
            ],
        };
    },
    mounted(){
    },
    methods:{
        // change(company){
        //     if(company == '杭州中策橡胶有限公司下沙基地'){
        //         console.log(1)
        //     }else{
        //         console.log(2)
        //     }
        // }
    }
    
}
</script>
<style scoped>
</style>
