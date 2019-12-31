import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import VueRouter from 'vue-router';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import "./assets/icon/iconfont"
import api from "./utils/api"
import Login from './components/login'
import CardManagement from "./components/CardManagement";

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.config.productionTip = false;

let router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/login', component: Login},
        {path: '/cardManagement', component: CardManagement}
    ]
});

Vue.prototype.$api = api;
new Vue({
    render: h => h(App),
    router: router,
}).$mount('#app');
