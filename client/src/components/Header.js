import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Navbar, Button, Container, Nav} from 'react-bootstrap'
import {logout} from '../api/requests';
import {SIGN_IN} from '../constants/routes';
import * as path from '../constants/routes';
import profileAvatar from '../assets/profile-icon.png';

export const Header = (props) => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        // TODO process errors
        await logout();
        localStorage.removeItem('token');
        navigate(SIGN_IN);
    };
    let links;
    if (props.hasOwnProperty('user') && props.user) {
        links = (
            <Nav>
                <Button type="button" variant="outline-primary" className="mx-1" onClick={() => {
                    navigate(path.PROFILE)
                }}>
                    {
                        props.user.avatar ? (
                        <img className="rounded-circle" style={{width: '30px'}} src={props.user.avatar.file}
                             alt="avatar"/>
                        ) : (
                            <img className="rounded-circle" style={{width: '30px'}} src={profileAvatar}
                             alt="avatar"/>
                        )
                    }
                    {props.user.username}
                </Button>
                <Button type="button" onClick={handleLogout} variant="outline-primary">Logout</Button>
            </Nav>
        );
    } else {
        links = (
            <Nav>
                <Link to={path.SIGN_IN} className="nav-link">Login</Link>
                <Link to={path.SIGN_UP} className="nav-link">Sign up</Link>
            </Nav>
        );
    }
    return (
        <Navbar expand="sm" className="bg-body-tertiary">
            <Container>
                <Link to={path.HOME} className="navbar-brand">Django Boards</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                    {links}
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
};