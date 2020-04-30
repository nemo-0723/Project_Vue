<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- 卡片区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable  @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search"  @click="search" ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4"><el-button type="primary" @click="goAddPage">添加商品</el-button></el-col>
            </el-row>

            <!-- 商品列表 -->
             <el-table  :data="goodsList" border stripe >
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="goods_name" label="商品名称" ></el-table-column>
                <el-table-column prop="goods_price" label="商品价格(元)" width="95"></el-table-column>
                <el-table-column prop="goods_weight" label="商品重量" width="70"></el-table-column>
                <el-table-column prop="add_time" label="创建时间" width="140">
                    <template slot-scope="scope">
                       {{scope.row.add_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="120">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.goods_id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row.goods_id)"></el-button>
                    </template>
                </el-table-column> 
            </el-table>
            <!--  分页区域-->
            <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-change="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>
    </div>
    
</template>
<script>
export default {
    data(){
        return{
            //获取商品列表的参数对象
            queryInfo:{
                //用户输入的搜索词
                query:'',
                //当前页码值
                pagenum:1,
                //当前每页显示几条数据
                pagesize:5
            },
            total:0,
            //商品列表数据
            goodsList:[],
        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
        //获取商品列表数据
        async getGoodsList(){
            const result = await this.$http.get('goods',{params:this.queryInfo});
            const res=result.data;
            console.log(res);
            if(res.meta.status!== 200) return this.$message.error(res.meta.msg)
            this.goodsList=res.data.goods;
            this.total=res.data.total;

        },
        //监听 pagesize 改变的事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getGoodsList()
        },
        //监听 页码值 改变的事件
        handleCurrentChange(newPagenum){
             this.queryInfo.pagenum=newPagenum;
            this.getGoodsList()
        },
        //搜索商品
        search(){
            this.getGoodsList()
        },
        //编辑修改商品弹窗
        showEditDialog(){

        },
        //删除商品
        deleteGoods(id){
            this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {
                //确定删除
                const result = await this.$http.delete(`goods/${id}`);
                const res = result.data;
                if(res.meta.status!== 200) {
                    return this.$message.error(res.meta.msg);
                }else{
                    this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                    this.getGoodsList()
                }
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        },
        //添加商品跳转页面
        goAddPage(){
            this.$router.push('/goods/add');
        }

    }
}
</script>
<style lang="less" scoped>

</style>