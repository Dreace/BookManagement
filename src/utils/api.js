import axios from 'axios'
import {Message} from 'element-ui'
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
            Message({
                message: data.message,
                type: 'error',
                duration: 5 * 1000
            });
            return Promise.reject(data.message)
        } else {
            return data
        }
    },
    error => {
        window.console.error(error);
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error)
    }
);
export default api