<template>
    <div> 
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
         <!-- 卡片区域 -->
        <el-card>
            <!-- 注意 -->
            <el-alert title="添加商品信息"  type="info" center show-icon :closable="false"></el-alert>
            <!-- 步骤条区域 -->
            <el-steps :active="activeIndex-0"  align-center finish-status="success">
                <el-step title="基本信息" ></el-step>
                <el-step title="商品参数" ></el-step>
                <el-step title="商品属性" ></el-step>
                <el-step title="商品照片" ></el-step>
                <el-step title="商品内容" ></el-step>
                <el-step title="完成" ></el-step>
            </el-steps>
            <!-- tab栏区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" label-position="top" class="demo-ruleForm">
                <el-tabs  v-model="activeIndex" tab-position="left" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <!-- 基本信息区域 -->
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" required prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" required prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" required prop="goods_weight">
                            <el-input v-model="addForm.goods_weight"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" required prop="goods_number">
                            <el-input v-model="addForm.goods_number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" required prop="goods_cat">
                            <!-- options用来指定数据源 -->
                            <!-- cascaderProps用来指定配置对象 -->
                            <el-cascader  :options="CateList"  :props="cascaderProps" v-model="addForm.goods_cat"   @change="CateChange" clearable  ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <!-- 渲染表单的item项   有几个动态参数 -->
                        <el-form-item :label="item.attr_name" v-for="(item,index) in manyTabList" :key="index">
                             <!-- 每一个动态参数下的可选项 -->
                            <el-checkbox-group v-model="item.attr_vals" >
                                <el-checkbox :label="item1" v-for="(item1,index1) in item.attr_vals" :key="index1" @change="CheckChange(item.attr_vals)" border></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <!-- 渲染表单的item项   有几个动态参数 -->
                        <el-form-item :label="item.attr_name" v-for="(item,index) in onlyTabList" :key="index">
                             <!-- 每一个动态参数下的可选项 -->
                            <el-input v-model="item.attr_vals" ></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <el-upload  :action="uploadUrl" :headers="headerObj" :on-preview="handlePreview" :on-remove="handleRemove"  list-type="picture" :on-success="handleSuccess" >
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器组件 -->
                        <quill-editor  ref="myQuillEditor" v-model="addForm.goods_introduce" @blur="onEditorBlur($event)"  @focus="onEditorFocus($event)" ></quill-editor>

                        <el-button type="primary" class="btn-add" @click="add">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片预览的弹窗 -->
        <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%"  >
            <el-image  :src="previewPath" ></el-image>
        </el-dialog>

    </div>
</template>
<script>
export default {
    data(){
        return{
            activeIndex:'0',
            //添加商品的表单数据对象
            addForm:{
                goods_name:'',
                goods_price:0, 
                goods_weight:0,
                goods_number:0,
                //商品所属的分类数组
                goods_cat:[],
                //图片数据
                pics:[],
                //商品详情
                goods_introduce:''
            },
            //添加商品的表单验证规则
            addFormRules:{
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1到 10 个字符', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' },
                    { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
                ],
                goods_cat:[
                     { required: true, message: '请选择', trigger: 'blur' },
                ]

            },
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
            //商品参数
            manyTabList:[],
            //商品属性
            onlyTabList:[],
            //上传图片的地址
            uploadUrl:'http://127.0.0.1:8888/api/private/v1/upload',
            //上传图片的请求头（element-ui中通过此方式添加token）
            headerObj:{
                Authorization:window.sessionStorage.getItem('token')
            },
            //图片预览的url
            previewPath:'',
            previewVisible:false
        }
    },
    created(){
        this.getCategoriosList()
    },
    methods:{
        //获取商品分类的数据列表
        async getCategoriosList(){
            const result = await this.$http.get('categories',{params:{type:3}});
            const res = result.data;
            if(res.meta.status!==200)  return this.$message.error(res.meta.msg);
            this.CateList = res.data ;
        },
        //级联选择器选中项发生变化，会触发这个函数
        CateChange(){
            if(this.addForm.goods_cat.length!==3){
                 this.addForm.goods_cat =[]
            }
        },
        //阻止标签页的切换
        //标签页切换时触发  activeName : 即将进入的标签页名称, oldActiveName ：之前的标签页名称
        beforeTabLeave(activeName, oldActiveName){
             if(oldActiveName=="0" && this.addForm.goods_cat.length!==3){
                 this.$message.error('请选择商品分类')
                 return false
             }
        },
        //点击标签页切换时触发
        async tabClicked(){
            //分类 ID 
            var id=this.addForm.goods_cat[2];
            //获取商品参数
            if(this.activeIndex==='1'){
                const result=await this.$http.get(`categories/${id}/attributes`,{params:{sel:'many'}})
                const res=result.data;
                if(res.meta.status!==200)  return this.$message.error(res.meta.msg);
                this.manyTabList=res.data;

                res.data.forEach(item=>{
                    item.attr_vals=item.attr_vals.length === 0?[]:item.attr_vals.split(' ')
                });
            }
            //获取商品属性
            else if(this.activeIndex==='2'){
                const result=await this.$http.get(`categories/${id}/attributes`,{params:{sel:'only'}})
                const res=result.data;
                if(res.meta.status!==200)  return this.$message.error(res.meta.msg);
                this.onlyTabList=res.data;
            }
        },
        //复选框选中状态改变时
        CheckChange(attr_vals){
            console.log(attr_vals)
        },
        //监听图片上传成功的事件
        handleSuccess(response, file, fileList){
            //1.先拼接得到一个图片信息对象
            const picInfo={pic:response.data.tmp_path};
            //2.将图片信息对象，push到pics数组中
            this.addForm.pics.push(picInfo);
        },
        //处理图片移除效果
        handleRemove(file) {
            //1.获取将要删除的图片的临时路径
            const filePath=file.response.data.tmp_path;
            //2.从pics中找到这个图片对应的索引值
            const i=this.addForm.pics.findIndex(x=>
                x.pic===filePath)
            //3.从pics中删除这张图片
            this.addForm.pics.splice(i,1)
            console.log(this.addForm)
        },
        //处理图片预览效果
        handlePreview(file) {
            this.previewPath=file.response.data.url;
            this.previewVisible=true
        },
        //添加商品
        add(){
            this.$refs.addFormRef.validate(async valid=>{
                if(!valid){
                    return this.$message.error('请填写必要的表单项')
                }
                //执行添加的业务逻辑
                // this.addForm.goods_cat=this.addForm.goods_cat.join(',');
                
                const result=await this.$http.post('goods',this.addForm);
                const res=result.data;
                console.log(res)
            })
        }

    }
}
</script>
<style lang="less" scoped>
.el-tabs{
    margin-top: 50px;
    margin-left: 20px;
}
.el-checkbox{
    margin:0 5px 0!important ;
}
.el-image{
    width: 100%;
    height: 300px;
}
.btn-add{
    margin-top: 20px;
}
</style>