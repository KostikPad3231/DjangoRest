import React from 'react';

import {Formik} from 'formik';
import {Form, Card, Button} from 'react-bootstrap';
import * as Yup from 'yup';

import {sendEmailResetPassword} from '../../api/requests';

// TODO make date validation
const PasswordResetEmailFormSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
});

export const PasswordResetEmailForm = () => {
    return (
        <Card style={{width: '18rem'}} className="mx-auto">
            <Card.Title>Enter email</Card.Title>
            <Card.Body>
                <Formik
                    initialValues={{
                        email: '',
                    }}
                    validationSchema={PasswordResetEmailFormSchema}
                    onSubmit={async values => {
                        console.log(values);
                        // TODO handle errors
                        try {
                            await sendEmailResetPassword(values)
                                .then(response => {
                                    console.log(response);
                                    // if (response.status === 201 && response.data.detail === 'Verification e-mail sent.') {
                                    //     navigate(SIGN_IN);
                                    //     // TODO swal should fire: email sent
                                    // }
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
                            <Form.Group className="mb-3" controlId="email">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    name="email"
                                    type="text"
                                    placeholder="Email"
                                    {...formik.getFieldProps('email')}
                                />
                                {formik.touched.email && formik.errors.email ? (
                                    <Form.Text className="text-muted">
                                        {formik.errors.email}
                                    </Form.Text>
                                ) : null}
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit email
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Card.Body>
        </Card>
    )
};