import axios from 'axios';
import store from '../store';
import {BACKEND_URL} from '../constants/index';

export const apiClient = function () {
    const token = store.getState().token;
    console.log('token', token);
    const params = {
        baseURL: BACKEND_URL,
        headers: {'Authorization': 'Bearer ' + token}
    }
    return axios.create(params);
};