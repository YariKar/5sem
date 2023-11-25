import { createRouter, createWebHashHistory } from 'vue-router'
//import Home from '../views/Home.vue'
import Login from './components/Login.vue'

const routes = [
    {path: '/', redirect: '/login'},
    { path: '/login', name: 'LoginComponent', component: Login },
    {path: '/user/:name', name: 'UserComponent', component: () => import( './components/Users')},
    {path: '/admin', name:'AdminComponent', component: () => import('./components/AdminComponent')}
    //{
        //path: '/about', name: 'About',
        // Создаст компонент, lazy-подгружаемый при первом обращении
        // about.[hash].js
        //component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
    //}
]
const router = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router