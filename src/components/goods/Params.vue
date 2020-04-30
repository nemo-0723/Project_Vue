<template>
    <div>
         <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>参数列表</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- 卡片区域 -->
        <el-card>
            <!-- 注意 -->
            <el-tag class="el-tag-width" type="warning"><i class="el-icon-warning"></i>  注意： 只允许为第三级分类设置相关参数！</el-tag>
            <el-form >
                <el-form-item label="选择商品分类 :" >
                    <!-- options用来指定数据源 -->
                    <!-- cascaderProps用来指定配置对象 -->
                    <el-cascader  :options="CateList"  :props="cascaderProps" v-model="seletedValue" clearable  @change="CateChange"></el-cascader>
                </el-form-item> 
            </el-form>
            <!-- tab页签区域 -->
            <el-tabs v-model="activeName" @tab-click="handleTypeClick">
                <!-- 添加动态参数的面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" :disabled="isDisabled" @click="showAddParams">添加参数</el-button>
                    <!-- 动态参数表格 -->
                    <el-table :data="manyTableData" border stripe >
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                 <!-- 渲染可选项 -->
                                <el-tag   v-for= "(item,index) in scope.row.attr_vals" :key="index" closable :disable-transitions="false" @close="handleClose(item)"> {{item}}</el-tag>
                                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="参数名称" prop="attr_name"></el-table-column>
                        <el-table-column  label="操作">
                            <template slot-scope="scope" >
                                <!-- 修改按钮 -->
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showSetParams(scope.row.attr_id)">修改</el-button>
                                <!-- 删除按钮 -->
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

                <!-- 添加静态属性的面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" :disabled="isDisabled" @click="showAddtypes">添加属性</el-button>
                    <!-- 静态属性表格 -->
                    <el-table :data="onlyTableData" border stripe >
                        <!-- 展开行 -->
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                 <!-- 渲染可选项 -->
                                <el-tag   v-for= "(item,index) in scope.row.attr_vals" :key="index" closable :disable-transitions="false" @close="handleClose(item)"> {{item}}</el-tag>
                                <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)"></el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <!-- 索引列 -->
                        <el-table-column type="index"></el-table-column>
                        <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                        <el-table-column  label="操作">
                            <template slot-scope="scope">
                                <!-- 修改按钮 -->
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showSetTypes(scope.row.attr_id)">修改</el-button>
                                <!-- 删除按钮 -->
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加参数和静态属性共用的对话框 -->
        <el-dialog  :title="'添加'+title"  :visible.sync="isShowAddDialog" width="50%"  @close="addDialogClose">
            <!-- 内容主体区域 -->
            <el-form  label-width="100px"  :model="addForm" :rules="addFormRlues" ref="addFormRef">
                <el-form-item :label="title" required  prop="attr_name">
                    <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowAddDialog = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改参数和静态属性共用的对话框 -->
        <el-dialog  :title="'修改'+title"  :visible.sync="isShowSetDialog" width="50%"  @close="setDialogClose">
            <!-- 内容主体区域 -->
            <el-form  label-width="100px"  :model="setForm" :rules="addFormRlues" ref="setFormRef">
                <el-form-item :label="title" required  prop="attr_name">
                    <el-input v-model="setForm.attr_name"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowSetDialog = false">取 消</el-button>
                <el-button type="primary" @click="confirmset">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return{
            //分类的数据列表
            CateList:[],
            //分类的数据列表中用来指定配置对象
            cascaderProps:{
                value:'cat_id' ,
                label:'cat_name',
                children:'children',
                expandTrigger:'hover'
            },
            //选中的分类的id数组
            seletedValue:[],
            //被激活的页签名称
            activeName: 'many',
            //动态参数数据
            manyTableData:[],
            //静态属性数据
            onlyTableData:[],
            //添加参数弹窗
            isShowAddDialog:false,
            title:'动态参数',
            //添加参数表单的数据对象
            addForm:{
                attr_name:''
            },
            //添加参数表单的数据验证规则
            addFormRlues:{
                attr_name:[ { required: true, message: '请输入参数名称', trigger: 'blur' },
                            { min: 2, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }]
            },
            //修改参数弹窗
            isShowSetDialog:false,
            //添加参数表单的数据对象
            setForm:{
                attr_name:'',
                attr_id:''
            },
            inputVisible:false,
            inputValue: '',
            attr_vals:[],
        }
    },
    computed:{
            //按钮是否禁用
            isDisabled(){
                if(this.seletedValue.length!==3){
                    return true;
                }
                return false;
            },
            //当前选中的三级分类的id
            cateId(){
                if(this.seletedValue.length===3){
                    return this.seletedValue[2];
                }
                    return null;
            }
    },
    created(){
        this.getCategoriosList()
    },
    methods:{
        //获取分类的数据列表
        async getCategoriosList(){
            const result = await this.$http.get('categories',{params:{type:3}});
            const res = result.data;
            if(res.meta.status!==200)  return this.$message.error(res.meta.msg);
            this.CateList = res.data ;
        },
        //选择项发生变化触发这个事件
        CateChange( ){
            this.getParamsData()
        },
        //tab页签点击事件的处理函数
         handleTypeClick(){
             this.getParamsData()
        },
        //获取参数数据
        async getParamsData( ){
            const result = await this.$http.get(`categories/${this.cateId}/attributes`,{params:{sel:this.activeName}});
            const res = result.data;
            if(res.meta.status!==200)  return this.$message.error('请选择分类');
            //判断数据是属于动态参数还是静态属性
            if(this.activeName==='many'){
                this.manyTableData=res.data;
            }
            this.onlyTableData=res.data;
            //每一个参数下的可选项 tag 
            res.data.forEach(item=>{
                item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[];
                this.attr_vals=item.attr_vals
            });
            
        },
        //添加动态参数弹窗
        showAddParams(){
            this.isShowAddDialog=true;
        },
        //添加静态属性弹窗
        showAddtypes(){
            this.title="静态属性",
            this.isShowAddDialog=true;
        },
        addDialogClose(){
            this.$refs.addFormRef.resetFields();
        },
        //添加参数
        addParams(){
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return this.$message.error('参数格式错误，添加失败');
                const result = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.activeName});
                const res = result.data;
                if(res.meta.status!==201)  return this.$message.error(res.meta.msg);
                this.isShowAddDialog=false;
                this.getParamsData();
            });
            
        },
        //修改参数时获取当前数据
        async getCurrentParams(attrId){
            this.setForm.attr_id=attrId;
            const result = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`,{params:{attr_sel:this.activeName}});
            const res = result.data;
            console.log(res)
            if(res.meta.status!==200)  return this.$message.error(res.meta.msg);
            this.setForm.attr_name=res.data.attr_name;
        },
        //修改动态参数弹窗
        showSetParams(attrId){
            this.getCurrentParams(attrId);
            this.isShowSetDialog=true;

        },
        //修改静态属性弹窗
        showSetTypes(attrId){
            this.title="静态属性",
            this.getCurrentParams(attrId);
            this.isShowSetDialog=true;
        },
        setDialogClose(){
            this.$refs.setFormRef.resetFields();
        },
        //确定修改
        async confirmset(){
            const result = await this.$http.put(`categories/${this.cateId}/attributes/${this.setForm.attr_id}`,{attr_name:this.setForm.attr_name,attr_sel:this.activeName});
            const res = result.data;
            if(res.meta.status!==200)  return this.$message.error(res.meta.msg);
            this.isShowSetDialog=false;
            this.getParamsData()
        },
        //删除动态参数和静态属性
        async deleteParams(attr_id){
            const result = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`);
            const res = result.data;
            console.log(res)
            if(res.meta.status!==200)  return this.$message.error(res.meta.msg);
            this.isShowSetDialog=false;
            this.getParamsData()
        },


        handleClose(item) {
            this.attr_vals.splice(this.attr_vals.indexOf(item), 1);
        },
        showInput() {
            this.inputVisible = true;
            this.$nextTick(_ => {
            this.$refs.saveTagInput.$refs.input.focus();
            });
        },
        async handleInputConfirm(row) {
            let inputValue = this.inputValue;
            if (inputValue) {
               this.attr_vals.push(inputValue);
               const result=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,{attr_name:row.attr_name,attr_sel:row.attr_sel,attr_vals:row.attr_vals.join(' ')});
               const res = result.data;
               this.getParamsData()
            }
            this.inputVisible = false;
            this.inputValue = '';
            
        }

    }
}
</script>
<style lang="less" scoped>
.el-tag-width{
    width: 100%;
    vertical-align: middle;
}
.el-icon-warning{
    font-size: 14px;
}
.el-form{
    margin-top: 20px;
}
.el-tag{
    margin-right: 10px;
}
.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}
.input-new-tag {
    width: 90px!important;
    margin-left: 10px;
    vertical-align: bottom;
  }
</style>
    
