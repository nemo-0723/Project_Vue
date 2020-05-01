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
            <el-row >
                <el-col :span="8">
                     <el-input placeholder="请输入内容" v-model="queryInfo.query"  clearable  @clear="ordersList">
                        <el-button slot="append" icon="el-icon-search"  @click="search" ></el-button>
                    </el-input>
                </el-col>
            </el-row>

            <!-- 订单列表 -->
             <el-table  :data="ordersList" border stripe >
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="order_number" label="订单编号" ></el-table-column>
                <el-table-column prop="order_price" label="订单价格" width="95"></el-table-column>
                <el-table-column prop="order_pay" label="是否付款" width="80">
                    <template slot-scope="scope">
                       <el-tag type="danger" v-if="scope.row.order_pay==='0'">未付款</el-tag>
                        <el-tag type="warning" v-else-if="scope.row.order_pay==='1'">待付款</el-tag>
                        <el-tag type="success " v-else-if="scope.row.order_pay==='2'">已付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="is_send" label="是否发货" width="140"></el-table-column>
                <el-table-column prop="create_time" label="下单时间" width="140">
                    <template slot-scope="scope">
                       {{scope.row.create_time | dataFormat}}
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="120">
                    <template >
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog"></el-button>
                        <!-- 查看物流按钮 -->
                        <el-button type="success" icon="el-icon-location" size="mini" @click="showTransDialog"></el-button>
                    </template>
                </el-table-column> 
            </el-table>
            <!--  分页区域-->
            <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-change="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>


        <!-- 修改地址的对话框 -->
        <el-dialog title="修改地址"  :visible.sync="editDialogVisible" width="50%" @close="addressDialogClose">
            <!-- 内容主体区域 -->
            <el-form  label-width="100px" :model="addressForm" :rules="addressFormRules" ref="addressFormRef">
                <el-form-item label="省市区/县" required prop="address1">
                    <el-cascader v-model="addressForm.address1"  :options="cityData"></el-cascader>
                </el-form-item>
                <el-form-item label="详细地址" required prop="address2">
                    <el-input v-model="addressForm.address2"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" >确 定</el-button>
            </span>
        </el-dialog>

        <!-- 查看物流的对话框 -->
        <el-dialog title="物流信息" :visible.sync="transDialogVisible"  width="50%" >
            <el-timeline>
                <el-timeline-item
                v-for="(progress, index) in progressInfo"
                :key="index"
                :timestamp="progress.time">
                {{progress.context}}
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
            
            
            
    </div>
</template>

<script>
import cityData from "./citydata";
export default {
    data(){
        return{
            //获取订单列表的参数对象
            queryInfo:{
                //用户输入的搜索词
                query:'',
                //当前页码值
                pagenum:1,
                //当前每页显示几条数据
                pagesize:5
            },
            //订单列表数据
            ordersList:[],
            //订单列表总数
            total:0,
            //修改地址的弹窗是否显示
            editDialogVisible:false,
            //修改地址表单
            addressForm:{
                address1:[],
                address2:''
            },
            //修改地址表单验证规则
            addressFormRules: {
                address1: [
                    { required: true, message: '请选择', trigger: 'blur' }
                ],
                address2: [
                    { required: true, message: '请输入详细地址', trigger: 'blur' }
                ]
            },
            //省市区联动的数据
            cityData,
            //查看物流的弹窗是否显示
            transDialogVisible:false,
            //物流信息
            progressInfo:[]
        }
    },
    created(){
        this.getOrdersList()
    },
    methods:{
        //获取商品列表数据
        async getOrdersList(){
            const result = await this.$http.get('orders',{params:this.queryInfo});
            const res=result.data;
            if(res.meta.status!== 200) return this.$message.error(res.meta.msg)
            this.ordersList=res.data.goods;
            this.total=res.data.total;
        },
        //监听 pagesize 改变的事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getOrdersList()
        },
        //监听 页码值 改变的事件
        handleCurrentChange(newPagenum){
             this.queryInfo.pagenum=newPagenum;
            this.getOrdersList()
        },
        //搜索商品
        search(){
            this.getOrdersList()
        },
        //展示修改地址的弹窗
        showEditDialog(){
            this.editDialogVisible=true;
        },
        //关闭修改地址的弹窗  清空表单
        addressDialogClose(){
            this.$refs.addressFormRef.resetFields()
        },
        //展示查看物流的弹窗
        async showTransDialog(){
            const result = await this.$http.get('kuaidi/1106975712662');
            const res=result.data;
            if(res.meta.status!== 200) return this.$message.error(res.meta.msg)
            console.log(res);
            this.progressInfo=res.data;
            this.transDialogVisible=true;
        }
    }

}
</script>

<style lang="less" scoped>
.el-cascader{
    width: 100%;
}
</style>