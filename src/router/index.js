import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import success from '../components/Success.vue'
import Home from '../views/Home.vue'
import Welcome from '../components/Welcome.vue'
import Course from '../views/Course.vue'
import Order from '../views/Order.vue'
import ManageCourse from '../views/ManageCourse.vue'
import ManageUser from '../views/ManageUser.vue'
import NoPower from '../views/NoPower.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/success',
    meta: {
      roles: ['admin', 'user']
  },
    component: success
  },
  {
    path: '/login',
    meta: {
      roles: ['admin', 'user']
  },
    component: Login
  },
  {
    path: '/home',
    meta: {
      roles: ['admin', 'user']
  },
    component: Home,
    redirect: '/welcome',
    children: [
      { path:'/welcome',meta: {
        roles: ['admin', 'user']
    }, component: Welcome},
      { path:'/course',meta: {
        roles: ['admin', 'user']
    }, component: Course},
      { path:'/order',meta: {
        roles: ['admin', 'user']
    }, component: Order},
    { path:'/manage_course',meta: {
      roles: ['admin']
  }, component: ManageCourse},
  { path:'/manage_user',meta: {
    roles: ['admin']
}, component: ManageUser},
{ path:'/no_power',meta: {
  roles: ['admin', 'user']
}, component: NoPower},
    ],
  },
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to:将要访问的路径
  // from:从哪里访问的路径
  // next:之后要做的任务，是一个函数
  //    next（）放行， next（'/URL'）强制跳转的路径。
  if (to.path == '/login') return next();// 访问路径为登录
  // // 获取flag
  const flagStr = window.sessionStorage.getItem("flag");// session取值
  if (flagStr != 'ok') return next('/login');// 没登录去登录
  next();
  const role = window.sessionStorage.getItem('role');
  if (to.meta.roles.includes(role)) {
    // if (to.path == '/login') return next();// 访问路径为登录
  // 获取flag
  // const flagStr = window.sessionStorage.getItem("flag");// session取值
  // if (flagStr != 'ok') return next('/login');// 没登录去登录
  next();
} else {
    next({path: '/no_power'})
}
})

export default router// 暴露出去
