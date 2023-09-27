import axios from 'axios';

import * as API_URL from '../index';

export const getMe = token => {
    try {
        const response = axios({
            method: 'get',
            url: API_URL.TOKEN_URL,
            headers: {Authorization: `Bearer ${token}`}
        });
        return response ? response : null;
    } catch (error) {
        console.log(error);
    }
};

export const getUsers = () => {
    return axios({
        method: 'get',
        url: API_URL.USERS,
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
    });
};

export const getUser = userId => {
    return axios({
        method: 'get',
        url: API_URL.USERS + userId,
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
    });
};

export const login = async values => {
    return await axios.post(API_URL.LOGIN, {...values});
};

export const logout = async () => {
    const response = await axios({
        method: 'post',
        url: API_URL.LOG_OUT,
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
    });
    return response;
};

export const confirmEmail = async values => {
    const response = await axios({
        method: 'post',
        url: API_URL.CONFIRM_EMAIL,
        data: {...values}
    });
    return response;
};

export const resetPassword = async (uid, token, values) => {
    const response = await axios({
        method: 'post',
        url: API_URL.RESET_PASSWORD + uid + '/' + token + '/',
        data: {
            uid: uid,
            token: token,
            new_password1: values.newPassword1,
            new_password2: values.newPassword2,
        }
    });
    return response;
};

export const signUp = async values => {
    return await axios.post(API_URL.REGISTER, {...values})
};

export const editProfile = async values => {
    const data = {
        username: values.username,
        email: values.email,
        auth_token: localStorage.getItem('token')
    };
    if (values.avatar) {
        data.avatar = values.avatar;
    }
    const response = await axios({
        method: 'put',
        url: API_URL.TOKEN_URL,
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
        data: data
    });
    return response;
};

export const getBoard = async (all = false, page = null) => {
    let url;
    if (all) {
        url = API_URL.GET_ALL_BOARDS;
    } else if (page) {
        url = API_URL.PAGINATE_BOARDS + page;
    } else {
        return;
    }

    const response = await axios({
        method: 'get',
        url: url,
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`}
    });
    return response;
};

export const createBoard = async values => {
    const response = await axios({
        method: 'post',
        url: API_URL.CRUD_BOARDS,
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
        data: {
            name: values.title,
            description: values.description,
        }
    });
    return response;
};

export const updateBoard = async (taskId, values) => {
    const response = await axios({
        method: 'put',
        url: API_URL.CRUD_BOARDS + taskId + '/',
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
        data: {
            name: values.title,
            description: values.description,
        }
    });
    return response;
};

export const deleteBoard = async taskId => {
    const response = await axios({
        method: 'delete',
        url: API_URL.CRUD_BOARDS + taskId + '/',
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
        data: {
            auth_token: localStorage.getItem('token')
        }
    });
    return response;
};

export const verifyToken = async () => {
    const response = await axios({
        method: 'get',
        url: API_URL.VERIFY_TOKEN,
        headers: {Authorization: `Bearer ${localStorage.getItem("token")}`},
    });
    return response;
};