import axios from 'axios'
import {Message} from 'element-ui'

axios.defaults.baseURL = 'https://book-api.dreace.top';
// axios.defaults.baseURL = 'http://127.0.0.1:105';
const api = axios.create({
    timeout: 5000,
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