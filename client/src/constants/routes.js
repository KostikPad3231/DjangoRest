export const ROOT = '/';
export const PROFILE = '/profile';
export const PASSWORD_CHANGE = '/profile/password/change';
export const PASSWORD_RESET = '/profile/password/reset';
export const PASSWORD_SET = '/profile/password/set';
export const PASSWORD_RESET_EMAIL = '/profile/password/reset/email';
export const SIGN_IN = '/login';
export const SIGN_UP = '/signup';
export const SIGN_UP_READER = '/signup/reader';
export const SIGN_UP_BLOGGER = '/signup/blogger';
export const CONFIRM_EMAIL = '/confirm-email';

export const BOARDS = '/boards';
export const BOARD_TOPICS = '/boards/:boardId';
export const TOPIC_POSTS = '/boards/:boardId/:topicId/*';
export const POST_CREATE = '/boards/:boardId/:topicId/create';
export const POST_EDIT = '/boards/:boardId/:topicId/:postId/edit';

export const TWITTER_SUCCESS = '/auth/twitter';
export const GITHUB_SUCCESS = '/auth/github';
export const GOOGLE_SUCCESS = '/auth/google';