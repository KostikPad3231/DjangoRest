import React from 'react';
import {Link} from 'react-router-dom';
import * as path from '../../constants/routes';
import './css/index.css';
import './css/App.css';

const Home = () => (
    <div className="App">
        <h1>Home page</h1>
        <p>
            <Link to={path.SIGN_IN}>Login</Link>
        </p>
        <p>
            <Link to={path.SIGN_UP}>Sign up</Link>
        </p>
        <p>
            <Link to={path.DASHBOARD}>Dashboard</Link>
        </p>
    </div>
);

export default Home;