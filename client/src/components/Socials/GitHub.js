import React, {useEffect, useState} from 'react';
import {Form, Card, Button, Container} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {HOME} from '../../constants/routes';
import {getGithubToken} from '../../api/requests';


export const GitHub = () => {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('key');
    localStorage.setItem('token', token);
    return (
        // TODO swal fire
        <Container className="bg-success text-white bg-gradient">
            <h1>You have successfully logged in with GitHub</h1>
            <Button variant="outline-success" onClick={() => {
                navigate(HOME);
            }}>
                Go to main page
            </Button>
        </Container>
    );
};