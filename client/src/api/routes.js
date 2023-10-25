import {BACKEND_URL} from '../constants';

export const PASSWORD_CHANGE = BACKEND_URL + '/auth/password/change/';
export const PASSWORD_SET = BACKEND_URL + '/auth/password/set/';
export const PASSWORD_RESET = BACKEND_URL + '/auth/password/reset/';
export const PASSWORD_RESET_CONFIRM = BACKEND_URL + '/auth/rest-auth/password/reset/confirm/';
export const EDIT_PROFILE = BACKEND_URL + '/api/user/me/edit/';
export  const PROFILE =  BACKEND_URL + '/api/user/me/';
export  const SIGN_UP =  BACKEND_URL + '/auth/registration/';
export  const LOGIN =  BACKEND_URL + '/auth/login/';
export  const LOG_OUT =  BACKEND_URL + '/auth/logout/';
export  const VERIFY_TOKEN =  BACKEND_URL + '/api/token/verify-token/';
export const CONFIRM_EMAIL = BACKEND_URL + '/auth/registration/confirm-email/';
export const BOARDS = BACKEND_URL + '/api/boards/';
export const TOPICS = BACKEND_URL + '/api/topics/';
export const CREATE_TOPIC = BACKEND_URL + '/api/topics/create/';
export const EDIT_POST = BACKEND_URL + '/api/posts/';


export const SOCIAL_LOGIN_URL = BACKEND_URL + '/oauth/';
export const SOCIALS = SOCIAL_LOGIN_URL + 'accounts/';

export const PRIVACY_PAGE = BACKEND_URL + '/pages/privacy';
export const TERMS_PAGE = BACKEND_URL + '/pages/terms';