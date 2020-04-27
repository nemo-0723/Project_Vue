<template>
    <div>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片区域 -->
        <el-card>
            <el-button type="primary" @click="addRolesdialogVisible = true" >添加角色</el-button>
            <!-- 角色列表 -->
             <el-table :data="rolesList" border stripe>
                <!-- 展开行 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row v-for= "(item1,index) in scope.row.children" :key="item1.id" :class="['bdbottom',index===0?'bdtop':'']">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级和三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row  v-for= "(item2,index) in item1.children" :key="item2.id" :class="[index===0?'':'bdtop']">
                                    <!-- 渲染二级权限 -->
                                    <el-col :span="7">
                                        <el-tag type="success" closable @close="removeRightById(scope.row,item2.id)">{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 通过for循环嵌套渲染三级权限 -->
                                    <el-col :span="17">
                                         <el-tag type="warning" closable v-for= "(item3,index) in item2.children" :key="item3.id" :class="[index===0?'':'bdtop']" @close="removeRightById(scope.row,item3.id)">{{item3.authName}}</el-tag>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="roleName" label="角色名称"></el-table-column>
                <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
                <el-table-column  label="操作" width="300">
                    <template slot-scope="scope">
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
                        <!-- 分配权限按钮 -->
                        <el-tooltip  effect="dark" content="分配角色" placement="top" :enterable="false">
                          <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRights(scope.row)">分配权限</el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
        <!-- 添加角色的对话框 -->
        <el-dialog title="添加角色"  :visible.sync="addRolesdialogVisible" width="30%" @close="dialogClose">
            <!-- 内容主体区域 -->
            <el-form  label-width="100px"  :model="addRolesForm" :rules="addRolesFormRules" ref="addRolesFormRef">
                <el-form-item label="角色名称" required  prop="roleName">
                    <el-input v-model="addRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" required  prop="roleDesc">
                    <el-input v-model="addRolesForm.roleDesc" ></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addRolesdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addROles">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 编辑角色的对话框 -->
        <el-dialog title="编辑角色"  :visible.sync="editRolesdialogVisible" width="30%" >
            <!-- 内容主体区域 -->
            <el-form  label-width="100px"  :model="editRolesForm" :rules="addRolesFormRules" ref="editRolesFormRef">
                <el-form-item label="角色名称" required  prop="roleName">
                    <el-input v-model="editRolesForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" required  prop="roleDesc">
                    <el-input v-model="editRolesForm.roleDesc" ></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRolesdialogVisible = false">取 消</el-button>
                <el-button type="primary" @click = "editRoles(editRolesForm.roleId)">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 分配权限的弹窗 -->
        <el-dialog title="分配权限" :visible.sync="setRightsdialogVisible" width="50%" @close="setRightDialogClosed">
            <!-- 树形控件 -->
            <el-tree :data="rightsList" show-checkbox node-key="id" default-expand-all :default-checked-keys="defkeys" :props="treeProps" ref="treeRef"></el-tree>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightsdialogVisible = false">取 消</el-button>
                <el-button type="primary"  @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>
    </div>

</template>
<script>
export default {
    data(){
        return{
            //角色列表数据
            rolesList:[],
            //添加角色的弹窗是否显示
            addRolesdialogVisible:false,
            //添加角色表单数据
            addRolesForm: {
                roleName: '',
                roleDesc:'',
            },
            //添加角色表单验证规则
            addRolesFormRules: {
                roleName: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                roleDesc: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            },
            //编辑角色的弹窗是否显示
            editRolesdialogVisible:false,
            //编辑角色表单数据
            editRolesForm: {
                roleId:'',
                roleName: '',
                roleDesc:'',
            },
            //分配权限的弹窗是否显示
            setRightsdialogVisible:false,
            //所有权限的数据
            rightsList:[],
            //树形控件的属性绑定对象
            treeProps: {
                children: 'children',
                label: 'authName'
            },
            //默认选中的节点id值
            defkeys:[],
            //当前即将分配权限的id
            roleId:0
        }
    },
    created(){
        this.getRolesList();
    },
    methods:{
        //获取角色列表
        async getRolesList(){
            const result = await this.$http.get('roles');
            const res = result.data;
            if(res.meta.status!==200) return this.$message.error(res.meta.msg)
            this.rolesList=res.data;
        },
        //监听添加角色对话框的关闭事件  表单清空
        dialogClose(){
            this.$refs.addRolesFormRef.resetFields();
        },
        //添加角色
        addROles(){
            this.$refs.addRolesFormRef.validate(async valid => {
                if (!valid) return;
                    //验证通过则发起登录请求
                    const result = await this.$http.post('roles',this.addRolesForm); //this.$http相当于axios
                    const res = result.data;
                    if(res.meta.status!==201) return this.$message.error('添加失败');
                    //添加成功的弹窗提示
                    this.$message({
                        message: '添加成功',
                        type: 'success'
                    });
                    //隐藏弹窗
                    this.addRolesdialogVisible = false;
                    this.getRolesList();
                });
        },
        //编辑角色
        async showEditDialog(id){
            this.editRolesdialogVisible = true;
            const result = await this.$http.get(`roles/${id}`);
            const res = result.data;
            if(res.meta.status!==200) return this.$message.error(res.meta.msg)
            this.editRolesForm=res.data;
        },
        //确认更改角色信息
        async editRoles(roleId){
            this.editRolesdialogVisible = false;
            const result = await this.$http.put(`roles/${roleId}/`,this.editRolesForm);
            const res = result.data;
            if(res.meta.status!==200) return this.$message.error(res.meta.msg)
            this.getRolesList()
        },
        //删除角色
        deleteRole(roleId){
            this.$confirm('此操作将永久删除该该用户, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {
                //确定删除
                const result = await this.$http.delete(`roles/${roleId}`);
                const res = result.data;
                if(res.meta.status!== 200) {
                    return this.$message.error(res.meta.msg);
                }else{
                    this.$message({
                    message: '删除成功',
                    type: 'success'
                });
                    this.getRolesList()
                }
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        },
        //根据id删除对应的权限
        removeRightById(role,rightId){
            //弹窗提示用户是否删除
            this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(async () => {
                //确定删除
                const result = await this.$http.delete(`roles/${role.id}/rights/${rightId}`);
                const res = result.data;
                if(res.meta.status!== 200) {
                    return this.$message.error(res.meta.msg);
                }else{
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    //防止删除数据时展开列关闭，我们避免了整个表格数据的冲洗渲染，而是选择渲染权限列表的数据即可
                    role.children = res.data;
                }
            }).catch(() => {
            this.$message({
                type: 'info',
                message: '已取消删除'
            });          
            });
        },
        //分配权限弹窗
        async setRights(role){
            this.roleId=role.id;
            //获取所有权限列表的数据
            const result = await this.$http.get('rights/tree');
            const res = result.data;
            //console.log(res)
            if(res.meta.status!==200) return this.$message.error(res.meta.msg)
            //把获取道德权限数据保存到data中
            this.rightsList=res.data;
            //根据三级权限的id确定已选中的权限  我的方法
            // children.forEach(element => {
            //     element.children.forEach(ele => {
            //         ele.children.forEach(e => {
            //             this.defkeys.push (e.id) ;
            //         })
            //     });
            // });
            //递归获取角色下所有三级权限的id
            this.getLeafKeys(role,this.defkeys);
            this.setRightsdialogVisible = true;

        },
        //通过递归的形式获取角色下所有三级权限的id,并保存到data中
        getLeafKeys(node,arr){
            //如果当前节点不包含children属性，则是三级节点
            if(!node.children){
                return arr.push(node.id)
            }
            node.children.forEach(item=>
              this.getLeafKeys(item,arr)
            )

        },
        //分配权限弹窗关闭时清空当前的数据
        setRightDialogClosed(){
            this.defkeys=[];
        },
        //确定为角色分配权限
        async allotRights(){
            const rightsId=this.$refs.treeRef.getCheckedKeys();
            const result = await this.$http.post(`roles/${this.roleId}/rights`,{rids:rightsId.join(",")});
            const res = result.data;
            if(res.meta.status!==200) {
                return this.$message.error(res.meta.msg)
            }else{
                this.getRolesList();
                this.setRightsdialogVisible = false;
            }
            
        } 
    }
}
</script>
<style lang="less" scoped>
.el-tag{
    margin: 7px;
}
.bdtop{
    border-top:1px solid #eee;
}
.bdbottom{
    border-bottom:1px solid #eee;
}
.el-row{
    display: flex;
    align-items: center;
}
</style>