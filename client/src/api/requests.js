import axios from 'axios';
import * as API_URL from './routes';

export const signUp = async (userType, values) => {
    return axios.post(API_URL.SIGN_UP + userType + '/', {...values});
};

export const getMe = async () => {
    return axios({
        method: 'get',
        url: API_URL.PROFILE,
        headers: {Authorization: `Token ${localStorage.getItem("token")}`},
    });
};

export const login = async values => {
    return axios.post(API_URL.LOGIN, {...values});
};

export const logout = async () => {
    return axios({
        method: 'post',
        url: API_URL.LOG_OUT,
        headers: {Authorization: `Token ${localStorage.getItem("token")}`},
    });
};

export const editProfile = async values => {
    return axios({
        method: 'put',
        url: API_URL.EDIT_PROFILE,
        headers: {Authorization: `Token ${localStorage.getItem("token")}`},
        data: values,
    });
};

export const verifyToken = async () => {
    return axios({
        method: 'get',
        url: API_URL.VERIFY_TOKEN,
        headers: {Authorization: `Token ${localStorage.getItem("token")}`},
    });
}

export const confirmEmail = async (key) => {
    return axios({
        method: 'post',
        url: API_URL.CONFIRM_EMAIL,
        data: {key},
    });
};

export const sendEmailResetPassword = async (values) => {
    return axios({
        method: 'post',
        url: API_URL.PASSWORD_RESET,
        data: values,
    });
};

export const resetPassword = async (uid, token, values) => {
    return axios({
        method: 'post',
        url: API_URL.PASSWORD_RESET_CONFIRM,
        data: {
            uid,
            token,
            new_password1: values.password1,
            new_password2: values.password2,
        },
    });
};

export const changePassword = async values => {
    return axios({
        method: 'post',
        url: API_URL.PASSWORD_CHANGE,
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
        data: values,
    });
};

export const setPassword = async values => {
    return axios({
        method: 'post',
        url: API_URL.PASSWORD_SET,
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
        data: values,
    })
}

export const getBoards = async (pageIndex) => {
    return axios({
        method: 'get',
        url: API_URL.BOARDS + `?page=${pageIndex + 1}`,
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
    });
};

export const deleteBoard = async (boardId) => {
    return axios({
        method: 'delete',
        url: API_URL.BOARDS + boardId + '/',
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
    });
};

export const editBoard = async (boardId, values) => {
    return axios({
        method: 'patch',
        url: API_URL.BOARDS + boardId + '/',
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
        data: values,
    });
};

export const createBoard = async (values) => {
    return axios({
        method: 'post',
        url: API_URL.BOARDS,
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
        data: values,
    });
};

export const getBoardTopics = async (boardId, pageIndex) => {
    return axios({
        method: 'get',
        url: API_URL.BOARDS + boardId + `/topics/?page=${pageIndex + 1}`,
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
    });
};

export const exportTopicsCSV = async (boardId) => {
    return axios({
        method: 'get',
        url: API_URL.BOARDS + boardId + `/topics/export/csv`,
        responseType: 'blob',
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
    });
};

export const exportTopicsPDF = async (boardId) => {
    return axios({
        method: 'get',
        url: API_URL.BOARDS + boardId + `/topics/export/pdf`,
        responseType: 'blob',
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
    });
};

export const deleteTopic = async (topicId) => {
    return axios({
        method: 'delete',
        url: API_URL.TOPICS + `${topicId}/`,
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
    });
};

export const createTopic = async (values) => {
    return axios({
        method: 'post',
        url: API_URL.CREATE_TOPIC,
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
        data: values,
    });
};

export const getTopicPosts = async (topicId, pageIndex) => {
    return axios({
        method: 'get',
        url: API_URL.TOPICS + topicId + `/posts/?page=${pageIndex + 1}`,
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
    });
};

export const getLastTopicPosts = async (topicId) => {
    return axios({
        method: 'get',
        url: API_URL.TOPICS + topicId + `/last-posts/`,
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
    });
};

export const editPost = async (postId, values) => {
    return axios({
        method: 'patch',
        url: API_URL.EDIT_POST + postId + '/',
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
        data: values,
    });
};

export const createPost = async (topicId, values) => {
    return axios({
        method: 'post',
        url: API_URL.TOPICS + topicId + '/posts/',
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
        data: values,
    });
};

export const getLoginLink = async (provider) => {
    // function getCookie(name) {
    //     var cookieValue = null;
    //     if (document.cookie && document.cookie !== '') {
    //         var cookies = document.cookie.split(';');
    //         for (var i = 0; i < cookies.length; i++) {
    //             var cookie = cookies[i].trim();
    //             if (cookie.substring(0, name.length + 1) === (name + '=')) {
    //                 cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
    //                 break;
    //             }
    //         }
    //     }
    //     return cookieValue;
    // }

    return axios({
        method: 'get',
        url: API_URL.SOCIAL_LOGIN_URL + provider + '/loginurl/',
    });
};

export const getSocials = async => {
    return axios({
        method: 'get',
        url: API_URL.SOCIALS,
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
    });
}

export const disconnectSocial = async id => {
    return axios({
        method: 'post',
        url: API_URL.SOCIALS + id + '/disconnect/',
        headers: {Authorization: `Token ${localStorage.getItem('token')}`},
    })
}