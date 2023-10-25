import React from 'react';

import {Formik} from 'formik';
import {Form, Card, Button} from 'react-bootstrap';
import * as Yup from 'yup';

import {resetPassword} from '../../api/requests';
import {useNavigate} from 'react-router-dom';
import {SIGN_IN} from '../../constants/routes';

// TODO move it to constants
const MIN_PASSWORD_LENGTH = 8;

// TODO make date validation
const PasswordResetSchema = Yup.object({
    password1: Yup.string()
        .min(
            MIN_PASSWORD_LENGTH,
            `Password has to be no more than ${MIN_PASSWORD_LENGTH} characters`
        )
        .required('Required'),
    password2: Yup.string()
        .required('You should confirm password')
        .min(
            MIN_PASSWORD_LENGTH,
            `Password has to be no more than ${MIN_PASSWORD_LENGTH} characters`
        )
});

export const PasswordReset = () => {
    const navigate = useNavigate();
    return (
        <Card style={{width: '18rem'}} className="mx-auto">
            <Card.Title>Enter new password</Card.Title>
            <Card.Body>
                <Formik
                    initialValues={{
                        password1: '',
                        password2: '',
                    }}
                    validationSchema={PasswordResetSchema}
                    onSubmit={async values => {
                        // TODO handle errors
                        try {
                            const locationArray = window.location.pathname.split('/');
                            const token = (locationArray[locationArray.length - 2]);
                            const uid = (locationArray[locationArray.length - 3]);
                            await resetPassword(uid, token, values)
                                .then(response => {
                                    if (response.status === 200) {
                                        navigate(SIGN_IN);
                                        // TODO swal should fire: password changed
                                    }
                                })
                                .catch(error => {
                                    console.log('error in axios', error);
                                })
                        } catch (error) {
                            console.log(error);
                        }
                    }}
                >
                    {formik => (
                        <Form noValidate onSubmit={formik.handleSubmit}>
                            <Form.Group className="mb-3" controlId="password1">
                                <Form.Label>New password</Form.Label>
                                <Form.Control
                                    name="password1"
                                    type="password"
                                    placeholder="Password"
                                    {...formik.getFieldProps('password1')}
                                />
                                {formik.touched.password1 && formik.errors.password1 ? (
                                    <Form.Text className="text-muted">
                                        {formik.errors.password1}
                                    </Form.Text>
                                ) : null}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="password2">
                                <Form.Label>Repeat new password</Form.Label>
                                <Form.Control
                                    name="password2"
                                    type="password"
                                    placeholder="Repeat password"
                                    {...formik.getFieldProps('password2')}
                                />
                                {formik.touched.password2 && formik.errors.password2 ? (
                                    <Form.Text className="text-muted">
                                        {formik.errors.password2}
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
    )
};