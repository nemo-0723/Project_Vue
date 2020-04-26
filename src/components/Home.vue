<template>
      <el-container>
        <!-- 页面头部 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt=""> 
                <span>电商后台管理平台</span>
            </div>
            <el-button type="info" @click="loginOut">退出</el-button>
        </el-header>
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse?'64px':'200px'">
                <!-- 折叠展开菜单按钮 -->
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu  background-color="#333744" text-color="#fff" active-text-color="#409eff" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" router :default-active="activePath" >
                    <!-- 一级菜单 -->
                    <!-- 因为elementui中这里的index规定只能是字符串格式，而且要是唯一的
                        1. 所以我们动态绑定了item.id
                        2.item.id为数字型，所以拼接空的字符串变成字符串格式-->
                    <el-submenu  :index="item.id + '' " v-for="item in menuList" :key="item.id">
                        <!-- 一级菜单的模板区域 -->
                        <template slot="title" class="oneMenu">
                            <!-- 图标 -->
                            <i :class="iconObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subItem.path"  v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{subItem.authName}}</span></el-menu-item>
                    </el-submenu>
                </el-menu >
            </el-aside>
            <!-- 内容主体部分 -->
            <el-main>
                <!-- 路由占位符 -->
                <router-view></router-view>
            </el-main>
        </el-container>

    </el-container>
</template>

<script>
export default {
    data(){
        return{
            //左侧菜单数据
            menuList:[],
            //左侧数据一级菜单图标
            iconObj:{
                '125': 'iconfont icon-users',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpingouwudai2',
                '102': 'iconfont icon-danju-tianchong',
                '145': 'iconfont icon-baobiao'
            },
            //是否折叠
            isCollapse:false,
            //被激活的链接地址
            activePath:''
        }
    },
    created(){
        //左侧菜单的渲染（因为页面一上来就要发起请求，所以在crated阶段调用）
        this.getMenuList();
        this.activePath=window.sessionStorage.getItem('activePath');

    },
    methods:{
        loginOut(){
            window.sessionStorage.clear();
            this.$router.push('/login');
        },
        //获取左侧菜单数据
        async getMenuList(){
           const res = await this.$http.get('menus');
           if(res.data.meta.status!== 200) return this.$message.error(res.data.meta.msg)
           this.menuList=res.data.data;
        },
        //点击按钮折叠展开菜单
        toggleCollapse(){
            this.isCollapse = !this.isCollapse;
        },
        //保存链接的激活状态
        saveNavState(activePath){
            window.sessionStorage.setItem('activePath',activePath)
        }

    }
    
}
</script>

<style lang="less" scoped>
.el-container{
    height: 100%;
}
.el-header{
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    background-color: #373d41;
    color: #fff;
    font-size: 20px;
    div{
        display: flex;
        align-items: center;
        span{
            margin-left: 20px;
        }
    }
}
.el-aside{
    background-color: #333744;
    .el-menu{
        border:0;
    }
}
.el-main{
    background-color: #eaedf1;
}
.iconfont{
    margin-right: 10px;
}
.toggle-button{
    background-color:#4a5064;
    font-size:10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}

</style>