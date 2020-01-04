import Vuex from "vuex";
import Vue from 'vue'
import axios from "axios"
import apiUrl from "@/utils/api.config";

Vue.use(Vuex);
const store = new Vuex.Store({
        state: {
            userInfo: {
                isLogin: false,
                name: "",
                permission: -1
            },
            menuIndex: ""
        }, mutations: {
            changeMenuIndex(state, payload) {
                state.menuIndex = payload
            },
            init(state, payload) {
                state.userInfo = payload
            },
            clear(state) {
                state.userInfo = {
                    isLogin: false,
                    name: "",
                    permission: -1
                };
                if (localStorage) {
                    localStorage.removeItem("userInfo")
                }
                axios.post(apiUrl + "/Logout");
            },
            change(state, payload) {
                state.userInfo = payload;
                if (localStorage) {
                    localStorage.setItem("userInfo", JSON.stringify(state.userInfo))
                }
            }
        }
    }
);
export default store;