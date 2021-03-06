import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import VueRouter from 'vue-router';
import store from "@/utils/store";
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import "./assets/icon/iconfont"
import api from "./utils/api"
import Login from './components/Login'
import CardManagement from "./components/CardManagement";
import BookManagement from './components/BookManagement'

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.config.productionTip = false;

let router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/login', component: Login},
        {path: '/searchBook', component: BookManagement},
        {path: '/cardManagement', component: CardManagement},
        {path: '/bookManagement', component: BookManagement},
        {path: '/borrowAndReturn', component: BookManagement}
    ]
});


Vue.prototype.$api = api;
Vue.prototype.$setCookie = function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
};
new Vue({
    render: h => h(App),
    router: router,
    store,
    mounted: function () {
        if (localStorage) {
            let value = localStorage.getItem("userInfo");
            if (value) {
                this.$store.commit("init", JSON.parse(value))
            }
        }
        if (this.$route.path === '/') {
            if (this.$store.state.userInfo.isLogin) {
                this.$router.push("/bookManagement")
            } else {
                this.$router.push("/searchBook")
            }
        }
    }
}).$mount('#app');

