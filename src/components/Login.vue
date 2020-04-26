<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域 -->
            <div class="avatar_box">
                <img src="../assets/iu.jpg" alt="">
            </div>
            <!-- 登录表单区域 -->
            <div class="login_form">
                <!-- 通过 ref 标注 DOM 元素  在 DOM 元素上通过 ref 属性标注，属性名称自定义 -->
                <el-form  ref="loginFormRef" :model="loginForm" :rules="loginFormRules" >
                    <!-- 用户名 -->
                    <el-form-item prop="username">
                        <el-input v-model="loginForm.username" prefix-icon="iconfont icon-touxiang" ></el-input>
                    </el-form-item>
                    <!-- 密码 -->
                    <el-form-item prop="password">
                        <el-input  v-model="loginForm.password" prefix-icon="iconfont icon-ai-eye" type="password"></el-input>
                    </el-form-item>
                    <!-- 按钮区域 -->
                    <el-form-item class="btns">
                        <el-button type="primary" @click="submitForm">登录</el-button>
                        <el-button type="info" @click="resetForm">重置</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                // 登录表单的数据绑定对象
                loginForm: {
                    username: '',
                    password:''
                },
                 loginFormRules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                    ]
            }
        }
    },
     methods: {
      //登录
      submitForm() {
        //通过 $refs 获取 DOM 元素 
        //使用ES7 中  async await 方式发送异步请求 async关键字放在函数之前 await用于接收结果（将promise对象转换为普通对象）
        this.$refs.loginFormRef.validate(async valid => {
          if (!valid) return;
            //验证通过则发起登录请求
            const result = await this.$http.post('login',this.loginForm); //this.$http相当于axios
            const res = result.data
            if(res.meta.status!==200) return this.$message.error('登录失败');
            //登录成功的弹窗提示
            this.$message({
                message: '恭喜你，登录成功',
                type: 'success'
            });
            //1.将登陆成功之后的token保存到客户端的 sessionStorage 中
              //1.1项目中除了登录之外的其它API接口，必须在登录之后才能访问
              //1.2token只应在当前网站打开期间生效，所以将token保存在 sessionStorage中
            window.sessionStorage.setItem('token',res.data.token);
             //2.通过编程式导航跳转到后台主页
             this.$router.push('/home');
        });
      },
      //点击重置表单
      resetForm() {
          //通过 $refs 获取 DOM 元素 
          this.$refs.loginFormRef.resetFields();
      }
    }
    } ;
</script>

<style lang="less" scoped>
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        position: absolute;
        left:50%;
        transform: translate(-50%,-50%);
        height: 130px;
        width: 130px;
        border:1px solid #eee;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #ddd;
        background-color: #fff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;
}

</style>
