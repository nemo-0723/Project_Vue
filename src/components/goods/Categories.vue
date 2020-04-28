<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- 卡片区域 -->
        <el-card>
            <el-button type="primary" @click="showAddCategoriesdialog" >添加分类</el-button>
             <!-- 商品分类列表 -->
             <tree-table class="tree-table" :data="categoryList" :columns="columns" :selection-type="false" :expand-type="false" show-index index-text="#" border>
                 <!-- 索引列 -->
                 <!-- 是否有效   作用域插槽 -->
                 <template slot="isok" slot-scope="scope">
                     <i class="el-icon-success" v-if="scope.row.cat_deleted===false"></i>
                     <i class="el-icon-error" v-else-if="scope.row.cat_deleted===true"></i>
                 </template>
                <!-- 排序   作用域插槽 -->
                 <template slot="sort" slot-scope="scope">
                     <el-tag v-if="scope.row.cat_level===0">一级</el-tag>
                     <el-tag v-else-if="scope.row.cat_level===1" type="success">二级</el-tag>
                     <el-tag v-else-if="scope.row.cat_level===2" type="warning">三级</el-tag>
                 </template>
                <template slot="set" slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini"   @click="deleteCate(scope.row.cat_id)">删除</el-button>
                </template>
             </tree-table>
             <!--  分页区域-->
            <el-pagination   @current-change="handleCurrentChange" :current-change="queryInfo.pagenum" :page-size="queryInfo.pagesize"  layout="total, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>


        <!-- 添加分类的弹窗 -->
        <el-dialog title="添加分类"  :visible.sync="addCategoriesdialog" width="50%" >
            <!-- 内容主体区域 -->
            <el-form  label-width="100px"  :model="addCategoriesForm"  :rules="addCategoriesFormRules">
                <el-form-item label="分类名称:" required  prop="cat_name">
                    <el-input v-model="addCategoriesForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:" >
                    <!-- options用来指定数据源 -->
                    <!-- cascaderProps用来指定配置对象 -->
                    <el-cascader  :options="parentCateList"  :props="cascaderProps" v-model="seletedValue" clearable  @change="parentCateChange"></el-cascader>
                </el-form-item>
                
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCategoriesdialog = false">取 消</el-button>
                <el-button type="primary" >确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data(){
        return{
            //商品分类列表
            categoryList:[],
            //商品分类列表总数
            total:0,
            //商品分类列表的查询参数
            queryInfo:{
                type:3,
                //当前页码值
                pagenum:1,
                //当前每页显示几条数据
                pagesize:5
            },
            columns:[
                { label:"分类名称",prop:'cat_name'},
                { label:"是否有效",
                  //表示 当前列被定义为模板列 
                  type:'template' ,
                  //表示 当前列使用的模板名称
                  template:'isok'
                },
                { label:"排序",type:'template' ,template:'sort'},
                { label:"操作",type:'template' ,template:'set'}
            ],
            //添加分类弹窗是否显示
            addCategoriesdialog:false,
            //添加分类表单数据
            addCategoriesForm: {
                //分类名称
                cat_name: '',
                //父级分类的id
                cat_pid: 0,
                //分类的等级，默认添加的是一级分类
                cat_level:0
            },
            //添加用户表单验证规则
            addCategoriesFormRules: {
                cat_name: [
                    { required: true, message: '请输入分类名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ]
            },
            //父级分类的数据列表
            parentCateList:[],
            //父级分类的数据列表中用来指定配置对象
            cascaderProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children',
                expandTrigger:'hover'
            },
            //选中的父级分类的id数组
            seletedValue:[]
        }
    },
    created(){
        this.getCategoryList();
    },
    methods:{
        //监听 页码值 改变的事件
        handleCurrentChange(newPagenum){
            this.queryInfo.pagenum=newPagenum;
            this.getCategoryList()
        },
        //商品分类列表
        async getCategoryList(){
            const result = await this.$http.get('categories',{params:this.queryInfo});
            const res = result.data;
            if(res.meta.status!==200)  return this.$message.error(res.meta.msg)
            this.categoryList = res.data.result;
            this.total=res.data.total;
        },
        //添加分类弹窗
        showAddCategoriesdialog(){
            this.getParentCategoriosList()
            this.addCategoriesdialog=true;
        },
        //获取父级分类的数据列表
        async getParentCategoriosList(){
            const result = await this.$http.get('categories',{params:{type:2}});
            const res = result.data;
            if(res.meta.status!==200)  return this.$message.error(res.meta.msg);
            this.parentCateList = res.data 
        },
        //选择项发生变化触发这个事件
        parentCateChange(){
            console.log(this.seletedValue)

        },
        //删除该分类
        deleteCate(cateId){
            this.$confirm('此操作将永久删除该该用户, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(async () => {
                            //确定删除
                            const result = await this.$http.delete(`categories/${cateId}`);
                            const res = result.data;
                            if(res.meta.status!== 200) {
                                return this.$message.error(res.meta.msg);
                            }else{
                                this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                                this.getCategoryList()
                            }
                        }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                        });
        }
    }
}
</script>

<style lang="less" scoped>
.el-icon-success{
    color: rgb(35, 219, 35);
}
.tree-table{
    margin-top: 15px;
}
</style>