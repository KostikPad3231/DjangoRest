import React, {useEffect, useState} from 'react';
import {Form, Card, Button, Container} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {HOME} from '../../constants/routes';


export const Twitter = () => {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    console.log(window.location);
    const token = searchParams.get('oauth_token');
    localStorage.setItem('token', token);
    return (
        // TODO swal fire
        <Container className="bg-success text-white bg-gradient">
            <h1>You have successfully logged in with Twitter</h1>
            <Button variant="outline-success" onClick={() => {
                navigate(HOME);
            }}>
                Go to main page
            </Button>
        </Container>
    );
};