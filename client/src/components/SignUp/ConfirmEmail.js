import React, {useContext} from 'react';

import {Formik} from 'formik';
import {Form, Card, Button} from 'react-bootstrap';
import {confirmEmail} from '../../api/requests';
import {useNavigate} from 'react-router-dom';
import {SIGN_IN} from '../../constants/routes'
import {MessageContext} from '../MessageContext';
import {Footer} from '../Footer';
import {Header} from '../Header';

export const ConfirmEmail = () => {
    const navigate = useNavigate();
    const {newMessage} = useContext(MessageContext);
    const handleSubmit = async () => {
        const locationArray = window.location.pathname.split('/');
        const key = (locationArray[locationArray.length - 2]);
        try {
            const response = await confirmEmail(key);
            if (response.status === 200) {
                newMessage('You successfully confirmed email. Now you can log in');
                navigate(SIGN_IN);
            }
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <Header/>
            <Card style={{width: '18rem'}} className="mx-auto">
                <Card.Title>Confirm email</Card.Title>
                <Card.Body>
                    <Button type="button" onClick={handleSubmit}>Confirm</Button>
                </Card.Body>
            </Card>
            <Footer/>
        </>
    )
};