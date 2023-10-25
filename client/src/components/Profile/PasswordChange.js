import React from 'react';

import {Formik} from 'formik';
import {Form, Card, Button} from 'react-bootstrap';
import * as Yup from 'yup';

import {changePassword} from '../../api/requests';
import {useNavigate} from 'react-router-dom';
import {SIGN_IN} from '../../constants/routes';

// TODO move it to constants
const MIN_PASSWORD_LENGTH = 8;

// TODO make date validation
const ChangePasswordSchema = Yup.object({
    old_password: Yup.string()
        .min(
            MIN_PASSWORD_LENGTH,
            `Password has to be no more than ${MIN_PASSWORD_LENGTH} characters`
        )
        .required('Required'),
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

export const PasswordChange = () => {
    return (
        <Card style={{width: '18rem'}} className="mx-auto">
            <Card.Title>Change password</Card.Title>
            <Card.Body>
                <Formik
                    initialValues={{
                        old_password: '',
                        new_password1: '',
                        new_password2: '',
                    }}
                    validationSchema={ChangePasswordSchema}
                    onSubmit={async values => {
                        // TODO handle errors
                        try {
                            await changePassword(values)
                                .then(response => {
                                    console.log(response);
                                    if (response.status === 200) {
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
                            <Form.Group className="mb-3" controlId="old_password">
                                <Form.Label>Old password</Form.Label>
                                <Form.Control
                                    name="old_password"
                                    type="password"
                                    placeholder="Old password"
                                    {...formik.getFieldProps('old_password')}
                                />
                                {formik.touched.old_password && formik.errors.old_password ? (
                                    <Form.Text className="text-muted">
                                        {formik.errors.old_password}
                                    </Form.Text>
                                ) : null}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="new_password1">
                                <Form.Label>New password</Form.Label>
                                <Form.Control
                                    name="new_password1"
                                    type="password"
                                    placeholder="New password"
                                    {...formik.getFieldProps('new_password1')}
                                />
                                {formik.touched.new_password1 && formik.errors.new_password1 ? (
                                    <Form.Text className="text-muted">
                                        {formik.errors.new_password1}
                                    </Form.Text>
                                ) : null}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="new_password2">
                                <Form.Label>Repeat new password</Form.Label>
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
    )
};