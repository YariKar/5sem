import { createApp } from 'vue'
import App from './App.vue'
import router from './Router'
import store from './store'
import VueSocketIO from 'vue-socket.io';
import Echarts from 'vue-echarts';
import 'echarts/lib/chart/bar';
import io from "socket.io-client";


export const SocketInstance = io('http://localhost:3001/');
const app = createApp(App)
.use(store)
.use(router,VueSocketIO, SocketInstance).component('chart', Echarts)

app.config.globalProperties.$socket = SocketInstance;
app.mount('#app')
