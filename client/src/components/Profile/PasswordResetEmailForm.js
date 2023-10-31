import React, {useContext} from 'react';

import {Formik} from 'formik';
import {Form, Card, Button} from 'react-bootstrap';
import * as Yup from 'yup';

import {sendEmailResetPassword} from '../../api/requests';
import {MessageContext} from '../MessageContext';
import {Header} from '../Header';
import {Footer} from '../Footer';

const PasswordResetEmailFormSchema = Yup.object({
    email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
});

export const PasswordResetEmailForm = () => {
    const {newMessage} = useContext(MessageContext);
    return (
        <>
            <Header/>
            <Card style={{width: '18rem'}} className="mx-auto mt-3">
                <Card.Title>Enter email</Card.Title>
                <Card.Body>
                    <Formik
                        initialValues={{
                            email: '',
                        }}
                        validationSchema={PasswordResetEmailFormSchema}
                        onSubmit={async values => {
                            try {
                                const response = await sendEmailResetPassword(values)
                                newMessage('Check your mailbox');
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
            <Footer/>
        </>
    )
};