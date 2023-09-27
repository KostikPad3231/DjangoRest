import {BACKEND_URL} from '../constants/index';

export const TOKEN_URL = BACKEND_URL + '/api/users/me/?format=json';
export const LOGIN = BACKEND_URL + '/auth/login/';
export const CONFIRM_EMAIL = BACKEND_URL + '/auth/password/reset/';
export const RESET_PASSWORD = BACKEND_URL + '/auth/rest-auth/password/reset/confirm/';
export const LOG_OUT = BACKEND_URL + '/auth/logout/';
export const REGISTER = BACKEND_URL + '/auth/registration/';
export const USERS = BACKEND_URL + '/api/users/';
export const VERIFY_TOKEN = BACKEND_URL + '/api/token/verify-token/'
export const CRUD_BOARDS = BACKEND_URL + "/api/boards/";
export const GET_ALL_BOARDS = BACKEND_URL + "/api/boards/?all";
export const PAGINATE_BOARDS = BACKEND_URL + "/api/boards/?page=";