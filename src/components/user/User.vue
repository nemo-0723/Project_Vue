<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="10">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable  @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="search" ></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4"><el-button type="primary" @click="dialogVisible = true">添加用户</el-button></el-col>
            </el-row>

            <!-- 用户信息列表 -->
             <el-table :data="userList" border stripe>
                 <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="username" label="姓名"></el-table-column>
                <el-table-column prop="email" label="邮箱" ></el-table-column>
                <el-table-column prop="mobile" label="电话"></el-table-column>
                <el-table-column prop="role_name" label="角色"></el-table-column>
                <el-table-column  label="状态">
                    <!-- 使用作用域插槽渲染用户状态 -->
                    <template slot-scope="scope">
                        <!-- 开关 -->
                        <el-switch v-model="scope.row.mg_state" @change="stateChanged(scope.row.id, scope.row.mg_state)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column  label="操作" width="180">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.id)"></el-button>
                        <!-- 分配角色按钮 -->
                        <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                          <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <!--  分页区域-->
            <el-pagination @size-change="handleSizeChange"  @current-change="handleCurrentChange" :current-change="queryInfo.pagenum" :page-sizes="[1, 2, 5, 10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户"  :visible.sync="dialogVisible" width="30%" @close="dialogClose">
            <!-- 内容主体区域 -->
            <el-form  label-width="100px" class="demo-ruleForm" :model="addForm" :rules="addFormRules" ref="addFormRef">
                <el-form-item label="用户名" required prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" required prop="password">
                    <el-input v-model="addForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" required prop="email">
                    <el-input v-model="addForm.email" type="email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" required prop="mobile">
                    <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户的对话框 -->
        <el-dialog title="修改用户信息"  :visible.sync="editDialogVisible" width="50%">
            <!-- 内容主体区域 -->
            <el-form  label-width="100px"  :model="editForm" :rules="addFormRules" ref="editFormRef">
                <el-form-item label="用户名" required prop="username">
                    <el-input v-model="editForm.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" required prop="email">
                    <el-input v-model="editForm.email" type="email"></el-input>
                </el-form-item>
                <el-form-item label="手机号" required prop="mobile">
                    <el-input v-model="editForm.mobile"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser(editForm.id)">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default{
    data(){
            //验证邮箱的规则
        var validateEmail = (rule, value, callback) => {
            let reg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('邮箱格式不正确'))
            }
        }
        //验证手机号的规则
        var validateMobile = (rule, value, callback) => {
            let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
            if (reg.test(value)) {
                callback()
            } else {
                callback(new Error('手机号码格式不正确'))
            }
        }   
        return{
            //获取用户列表的参数对象
            queryInfo:{
                //用户输入的搜索词
                query:'',
                //当前页码值
                pagenum:1,
                //当前每页显示几条数据
                pagesize:2
            },
            //用户列表
            userList:[],
            //用户总数
            total:0,
            //添加用户的对话框是否显示
            dialogVisible: false,
            //添加用户表单数据
            addForm: {
                username: '',
                password:'',
                email:'',
                mobile:''
            },
            //添加用户表单验证规则
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: validateEmail, trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { validator: validateMobile, trigger: 'blur' }
                ]
            },
            //修改用户的对话框是否显示
            editDialogVisible:false,
            //修改用户表单数据
            editForm: {
                username: '',
                email:'',
                mobile:'',
                id:''
            },
            
        }
    },
    created(){
        this.getUserList();
    },
    methods:{
        //获取用户列表
        async getUserList(){
            //get请求通过params携带请求参数
            const result = await this.$http.get('users',{params:this.queryInfo});
            const res = result.data;
            if(res.meta.status!== 200) return this.$message.error(res.meta.msg)
            this.userList=res.data.users;
            this.total=res.data.total;
        },
        //监听 pagesize 改变的事件
        handleSizeChange(newSize){
            this.queryInfo.pagesize=newSize;
            this.getUserList()
        },
        //监听 页码值 改变的事件
        handleCurrentChange(newPagenum){
             this.queryInfo.pagenum=newPagenum;
            this.getUserList()
        },
        //监听 用户状态的改变
        async stateChanged(id,state){
            const result = await this.$http.put(`users/${id}/state/${state}`);
            const res = result.data;
            if(res.meta.status!== 200) {
                //若失败，则取反状态，保证状态不变
                state=!state;
                return this.$message.error(res.meta.msg);
            }else{
            this.$message({
                message: res.meta.msg,
                type: 'success'
            });
            }
        },
        //查询用户
        search(){
            this.getUserList()
        },
        //监听添加用户对话框的关闭事件  表单清空
        dialogClose(){
            this.$refs.addFormRef.resetFields();
        },
        //点击 按钮添加新用户
        addUser(){
            this.$refs.addFormRef.validate(async valid => {
            if (!valid) return;
                //验证通过则发起登录请求
                const result = await this.$http.post('users',this.addForm); //this.$http相当于axios
                const res = result.data;
                console.log(res)
                if(res.meta.status!==201) return this.$message.error('添加失败');
                //登录成功的弹窗提示
                this.$message({
                    message: '添加成功',
                    type: 'success'
                });
                //隐藏弹窗
                this.dialogVisible = false;
                this.getUserList();
            });
        },
        //点击修改用户显示弹窗并获取对应数据
        async showEditDialog(id){
            this.editDialogVisible = true;
           var userId=id;
            const result = await this.$http.get(`users/${id}`);
            const res = result.data;
            if(res.meta.status!== 200) {
                return this.$message.error(res.meta.msg);
            }else{
                this.editForm.username=res.data.username;
                this.editForm.email=res.data.email;
                this.editForm.mobile=res.data.mobile;
                this.editForm.id=res.data.id;
            }
        },
        //点击确认修改用户信息
        editUser(userId){
            this.$refs.editFormRef.validate(async valid => {
            if (!valid) return;
                //验证通过则发起登录请求
                const result = await this.$http.put(`users/${userId}`,this.editForm); //this.$http相当于axios
                const res = result.data;
                if(res.meta.status!==200) return this.$message.error('修改失败');
                //登录成功的弹窗提示
                this.$message({
                    message: '修改成功',
                    type: 'success'
                });
                //隐藏弹窗
                this.editDialogVisible = false;
                this.getUserList();
            });
        },
        //删除用户
        deleteUser(userId){
            this.$confirm('此操作将永久删除该该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {
                //确定删除
                const result = await this.$http.delete(`users/${userId}`);
                const res = result.data;
                if(res.meta.status!== 200) {
                    return this.$message.error(res.meta.msg);
                }else{
                    this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                    this.getUserList()
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
.el-dialog{
    width: 40%!important;
}
</style>