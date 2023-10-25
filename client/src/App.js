import React, {useState} from 'react';

import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import {Login} from './components/Login';
import {Registration} from './components/SignUp/Registration';
import {Home} from './components/Boards/Home';
import {Profile} from './components/Profile/Profile';
import {SignUpReader} from './components/SignUp/SignUpReader';
import {SignUpBlogger} from './components/SignUp/SignUpBlogger';
import {ConfirmEmail} from './components/SignUp/ConfirmEmail';

import {isAuth} from './hoc/isAuth';
import * as path from './constants/routes';

import './App.css';
import 'react-datepicker/dist/react-datepicker.css';
import {ReaderProfile} from './components/Profile/ReaderProfile';
import {BloggerProfile} from './components/Profile/BloggerProfile';
import {PasswordReset} from './components/Profile/PasswordReset';
import {PasswordResetEmailForm} from './components/Profile/PasswordResetEmailForm';
import {PasswordChange} from './components/Profile/PasswordChange';
import {BoardTopics} from './components/Boards/BoardTopics';
import {TopicPosts} from './components/Boards/TopicPosts';
import {EditPost} from './components/Boards/EditPost';
import {CreatePost} from './components/Boards/CreatePost';
import {Twitter} from './components/Socials/Twitter';
import {GitHub} from './components/Socials/GitHub';
import {Google} from './components/Socials/Google';
import {Messages} from './components/Messages';
import {PasswordSet} from './components/Profile/PasswordSet';
import {Root} from './components/Root';

const router = createBrowserRouter([
    {
        path: path.ROOT,
        element: (isAuth(Root)),
        children: [
            {
                path: path.BOARDS,
                element: isAuth(Home),
            },
            {
                path: path.BOARD_TOPICS,
                element: isAuth(BoardTopics),
            },
        ],
    },

    {
        path: path.POST_CREATE,
        element: isAuth(CreatePost),
    },
    {
        path: path.POST_EDIT,
        element: isAuth(EditPost),
    },
    {
        path: path.TOPIC_POSTS,
        element: isAuth(TopicPosts),
    },

    {
        path: path.PASSWORD_CHANGE,
        element: isAuth(PasswordChange),
    },
    {
        path: path.PASSWORD_SET,
        element: <PasswordSet/>
    },
    {
        path: path.PASSWORD_RESET_EMAIL,
        element: <PasswordResetEmailForm/>,
    },
    {
        path: path.PASSWORD_RESET + '/*',
        element: <PasswordReset/>,
    },
    {
        path: path.CONFIRM_EMAIL + '/*',
        element: <ConfirmEmail/>,
    },
    {
        path: path.PROFILE,
        element: isAuth(Profile),
    },
    {
        path: path.READER_PROFILE,
        element: isAuth(ReaderProfile),
    },
    {
        path: path.BLOGGER_PROFILE,
        element: isAuth(BloggerProfile),
    },
    {
        path: path.SIGN_IN,
        element: <Login/>,
    },
    {
        path: path.SIGN_UP,
        element: <Registration/>,
    },
    {
        path: path.SIGN_UP_READER,
        element: <SignUpReader/>,
    },
    {
        path: path.SIGN_UP_BLOGGER,
        element: <SignUpBlogger/>,
    },
    {
        path: path.TWITTER_SUCCESS,
        element: <Twitter/>,
    },
    {
        path: path.GITHUB_SUCCESS,
        element: <GitHub/>,
    },
    {
        path: path.GOOGLE_SUCCESS,
        element: <Google/>,
    },
]);

export const App = () => {
    return (
        <div className="App">
            <RouterProvider router={router}/>
        </div>
    );
};


