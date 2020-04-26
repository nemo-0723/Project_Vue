import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import User from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Roles from '../components/power/Roles.vue'


Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { 
    path: '/home',
    component: Home,
    redirect: '/welcome' ,
    children:[{path: '/welcome', component: Welcome},
              {path: '/users', component: User},
              {path: '/rights', component: Rights},
              {path: '/roles', component: Roles}]
  }

]
const router = new VueRouter({
  routes
})

//挂载路由导航守卫控制访问权限
router.beforeEach((to,from,next)=>{
  //to表示将要访问的路径  from 表示从哪个路径来  next是一个函数，表示放行【next（）：放行   next（'/login'）:强制跳转 】

  //1.如果要访问的是登录页，则直接放行即可
  //2.如果要访问的不是登录页，则判断用户是否登录（检查是否有token）
    //2.1有token,则直接放行即可
    //2.2没有token,则强制跳转到登录页
  if(to.path==='/login'){
    return next()
  }else{
    const tokenVal=window.sessionStorage.getItem('token');
    if(tokenVal){
      next()
    }else{
      return next('/login')
    }
  }
})


export default router
