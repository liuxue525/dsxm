import Vue from 'vue'
import Router from 'vue-router'
import Header from '@/components/common/Header'
import Test from '@/components/Test'
import Type from '@/components/shop/Type'
import Pp from '@/components/shop/Pinpai'
import Shuxing from '@/components/shop/Shuxing'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/test'
    },
    {
      path: '/',
      component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
      meta: { title: '自述文件' },
      children: [
        {
          path: '/test',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/Test.vue'),
          meta: { title: '系统首页' }
        },{
          path: '/Type',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Type.vue'),
          meta: { title: '分类管理' }
        },{
          path: '/Pp',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Pinpai.vue'),
          meta: { title: '品牌管理' }
        },{
          path: '/Shuxing',
          component: () => import(/* webpackChunkName: "dashboard" */ '../components/shop/Shuxing.vue'),
          meta: { title: '属性管理' }
        }

      ]
    }
  ]
})
