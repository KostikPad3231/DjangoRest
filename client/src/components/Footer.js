import React from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Navbar, Button, Container, Nav, Row, Col} from 'react-bootstrap'
import {logout} from '../api/requests';
import {SIGN_IN} from '../constants/routes';
import * as path from '../constants/routes';
import profileAvatar from '../assets/profile-icon.png';
import {PRIVACY_PAGE, TERMS_PAGE} from '../api/routes';

export const Footer = (props) => {
    return (
        <footer className="pt-5 border-top mt-auto mb-5">
            <Row className="text-center gx-0">
                <Col>
                    <a href={PRIVACY_PAGE} className="link-offset-3 link-opacity-50-hover">Privacy Policy</a>
                </Col>
                <Col>
                    <a href={TERMS_PAGE} className="link-offset-3 link-opacity-50-hover">Terms and Conditions</a>
                </Col>
            </Row>
        </footer>
    )
};