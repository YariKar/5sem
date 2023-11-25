import { createApp } from 'vue'
import App from './App.vue'
import router from './Router'
import store from './store'
import VueSocketIO from 'vue-socket.io';
//import Echarts from 'vue-echarts';
//import 'echarts/lib/chart/bar';
import io from "socket.io-client";
//import {cors} from "cors"


export const SocketInstance = io('http://localhost:3001/');
const app = createApp(App)
.use(store)//.component('chart', Echarts)
.use(router,VueSocketIO, SocketInstance)

app.config.globalProperties.$socket = SocketInstance;
app.mount('#app')
