import {combineReducers} from 'redux';
import * as actionType from '../actions/index';

const tokenInitialState = {
    token: ''
};

const boardsInitialState = {
    data: []
};

const user = (state = tokenInitialState, action) => {
    switch (action.type) {
        case actionType.SET_TOKEN:
            return {
                ...state,
                token: action.payload
            };
        default:
            return state;
    }
};

const boards = (state = boardsInitialState, action) => {
    switch (action.type) {
        case actionType.SET_TASKS:
            return {
                ...state,
                data: action.data
            };
        default:
            return state;
    }
};

const appReducer = combineReducers({
    user,
    boards
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
}

export default rootReducer;