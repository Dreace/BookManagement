import axios from 'axios'
import {Notification} from 'element-ui'
import apiUrl from "@/utils/api.config";

axios.defaults.baseURL = apiUrl;
const api = axios.create({
    timeout: 60000,
    withCredentials: true
});

api.interceptors.request.use(config => {
    return config
}, error => {
    window.console.log(error);
    Promise.reject(error)
});
api.interceptors.response.use(
    res => {
        let data = res.data;
        if (data.code !== 0) {
            if (data.code === -10) {
                setTimeout(() => top.location.href = '/login', 1000)

            }
            Notification({
                title: data.message,
                type: 'error',
            });
            return Promise.reject(data.message)
        } else {
            return data
        }
    },
    error => {
        window.console.error(error);
        Notification({
            title: error.message,
            type: 'error',
        });
        return Promise.reject(error)
    }
);
export default api