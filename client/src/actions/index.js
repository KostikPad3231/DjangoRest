import * as actionType from '../constants/index';

export const setToken = data => {
    return {
        type: actionType.SET_TOKEN,
        data
    };
};

export const SET_TOKEN = 'SET_TOKEN';

export const setTask = data => {
    return {
        type: actionType.SET_TASK,
        data
    };
};

export const SET_TASKS = 'SET_TASKS';