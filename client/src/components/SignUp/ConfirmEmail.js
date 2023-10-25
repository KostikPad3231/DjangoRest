import React from 'react';

import {Formik} from 'formik';
import {Form, Card, Button} from 'react-bootstrap';
import {confirmEmail} from '../../api/requests';
import {useNavigate} from 'react-router-dom';
import {SIGN_IN} from '../../constants/routes'

export const ConfirmEmail = () => {
    const navigate = useNavigate();
    const handleSubmit = async () => {
        const locationArray = window.location.pathname.split('/');
        const key = (locationArray[locationArray.length-2]);
        // TODO process errors
        const response = await confirmEmail(key);
        if(response.status === 200){
            navigate(SIGN_IN);
        }
    }

    return (
        <Card style={{width: '18rem'}} className="mx-auto">
            <Card.Title>Confirm email</Card.Title>
            <Card.Body>
                <Button type="button" onClick={handleSubmit}>Confirm</Button>
            </Card.Body>
        </Card>
    )
};