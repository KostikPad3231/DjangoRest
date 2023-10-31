import React, {useContext} from 'react';

import {Formik} from 'formik';
import {Form, Card, Button} from 'react-bootstrap';
import * as Yup from 'yup';

import {changePassword, setPassword} from '../../api/requests';
import {useNavigate} from 'react-router-dom';
import {PROFILE, SIGN_IN} from '../../constants/routes';
import {Header} from '../Header';
import {MessageContext} from '../MessageContext';
import {Footer} from '../Footer';
import {MIN_PASSWORD_LENGTH} from '../../constants';

const SetPasswordSchema = Yup.object({
    new_password1: Yup.string()
        .min(
            MIN_PASSWORD_LENGTH,
            `Password has to be no more than ${MIN_PASSWORD_LENGTH} characters`
        )
        .required('Required'),
    new_password2: Yup.string()
        .required('You should confirm password')
        .min(
            MIN_PASSWORD_LENGTH,
            `Password has to be no more than ${MIN_PASSWORD_LENGTH} characters`
        )
});

export const PasswordSet = ({user}) => {
    const navigate = useNavigate();
    const {newMessage} = useContext(MessageContext);
    return (
        <>
            <Header user={user}/>
            <Card style={{width: '18rem'}} className="mx-auto mt-3">
                <Card.Title>Set password</Card.Title>
                <Card.Body>
                    <Formik
                        initialValues={{
                            new_password1: '',
                            new_password2: '',
                        }}
                        validationSchema={SetPasswordSchema}
                        onSubmit={async values => {
                            try {
                                const response = await setPassword(values);
                                if (response.status === 200) {
                                    newMessage('Password has been saved');
                                    navigate(PROFILE);
                                }
                            } catch (error) {
                                console.log(error);
                            }
                        }}
                    >
                        {formik => (
                            <Form noValidate onSubmit={formik.handleSubmit}>

                                <Form.Group className="mb-3" controlId="new_password1">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        name="new_password1"
                                        type="password"
                                        placeholder="Password"
                                        {...formik.getFieldProps('new_password1')}
                                    />
                                    {formik.touched.new_password1 && formik.errors.new_password1 ? (
                                        <Form.Text className="text-muted">
                                            {formik.errors.new_password1}
                                        </Form.Text>
                                    ) : null}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="new_password2">
                                    <Form.Label>Repeat password</Form.Label>
                                    <Form.Control
                                        name="new_password2"
                                        type="password"
                                        placeholder="Repeat password"
                                        {...formik.getFieldProps('new_password2')}
                                    />
                                    {formik.touched.new_password2 && formik.errors.new_password2 ? (
                                        <Form.Text className="text-muted">
                                            {formik.errors.new_password2}
                                        </Form.Text>
                                    ) : null}
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Card.Body>
            </Card>
            <Footer/>
        </>
    )
};