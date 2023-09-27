import React, {Component, lazy, Suspense} from 'react';
import {Routes, Route} from 'react-router-dom';

import * as path from '../src/constants/routes';
import Main from './components/Main';
import Loader from './components/Loader';

import Home from './pages/Home/index';
import Login from './pages/Login//index';
import SignUp from './pages/SignUp/index';
import PageNotFound from './components/PageNotFound/index';

import './App.css';

const Dashboard = lazy(() => import('./pages/Dashboard/index'));
const Profile = lazy(() => import('./pages/Dashboard/Profile/index'));
const Boards = lazy(() => import('./pages/Dashboard/Boards/index'));
const ConfirmEmail = lazy(() => import('./pages/ConfirmEmail/index'));
const ResetPassword = lazy(() => import('./pages/ResetPassword/index'));

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI.
        return {hasError: true};
    }

    componentDidCatch(error, info) {
        // Example "componentStack":
        //   in ComponentThatThrows (created by App)
        //   in ErrorBoundary (created by App)
        //   in div (created by App)
        //   in App
        console.log(error, info.componentStack);
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return this.props.fallback;
        }

        return this.props.children;
    }
}

class App extends Component {

    render() {
        return (
            <ErrorBoundary fallback={<p>Something went wrong</p>}>
                <Routes>
                    <Route exact path={path.HOME} element={<Home/>}/>
                    <Route path={path.SIGN_IN} element={<Login/>}/>
                    <Route exact path={path.SIGN_UP} element={<SignUp/>}/>
                </Routes>
                <Main {...this.props}>
                    <Suspense fallback={<Loader/>}>
                        <Routes>
                            <Route
                                exact
                                path={path.DASHBOARD}
                                Component={Dashboard}
                            />
                            <Route
                                exact
                                path={path.BOARDS}
                                Component={Boards}
                            />
                            <Route
                                exact
                                path={path.PROFILE}
                                Component={Profile}
                            />
                            <Route
                                exact
                                path={path.CONFIRM_EMAIL}
                                Component={ConfirmEmail}
                            />
                            <Route
                                exact
                                path={path.RESET_PASSWORD}
                                Component={ResetPassword}
                            />
                            <Route render={props => <PageNotFound {...props} />}/>
                        </Routes>
                    </Suspense>
                </Main>
            </ErrorBoundary>
        );
    }
}

export default App;