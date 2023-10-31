import React, {useEffect, useState} from 'react';
import {Form, Card, Button, Container} from 'react-bootstrap';
import {useNavigate} from 'react-router-dom';
import {BOARDS} from '../../constants/routes';


export const Twitter = () => {
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('oauth_token');
    localStorage.setItem('token', token);
    return (
        <div className="w-100 h-100 position-absolute d-flex flex-column justify-content-center">
            <Container className="bg-success text-white bg-gradient rounded p-3">
                <h1>You have successfully logged in with Twitter</h1>
                <div className="d-flex justify-content-center">
                    <Button className="" onClick={() => {
                        navigate(BOARDS);
                    }}>
                        Go to main page
                    </Button>
                </div>
            </Container>
        </div>
    );
};