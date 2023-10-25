import React from 'react';
import {Formik} from 'formik';
import {Form, Card, Button} from 'react-bootstrap';
import DropdownMultiselect from 'react-multiselect-dropdown-bootstrap';
import * as Yup from 'yup';
import {signUp} from '../../api/requests';

// TODO move it to constants
const MIN_PASSWORD_LENGTH = 8;

const ReaderRegisterSchema = Yup.object({
    username: Yup.string()
        .required('Required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
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

export const ReaderProfile = () => {
    return (
        <Card style={{width: '18rem'}} className="mx-auto">
            <Card.Title>Sign up as a reader</Card.Title>
            <Card.Body>
                <Formik
                    initialValues={{
                        username: '',
                        email: '',
                        password1: '',
                        password2: '',
                        has_eighteen: false,
                        interests: [],
                    }}
                    validationSchema={ReaderRegisterSchema}
                    onSubmit={async values => {
                        // TODO handle errors
                        try {
                            await signUp('reader', values)
                                .then(response => {
                                    if (response.status === 201 && response.data.detail === 'Verification e-mail sent.') {
                                        // TODO swal should fire: account created
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
                            <Form.Group className="mb-3" controlId="username">
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    name="username"
                                    type="text"
                                    placeholder="Username"
                                    {...formik.getFieldProps('username')}
                                />
                                {formik.touched.username && formik.errors.username ? (
                                    <Form.Text className="text-muted">
                                        {formik.errors.username}
                                    </Form.Text>
                                ) : null}
                            </Form.Group>

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

                            <Form.Group className="mb-3" controlId="password1">
                                <Form.Label>Password</Form.Label>
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
                                <Form.Label>Repeat Password</Form.Label>
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

                            <Form.Group className="mb-3" controlId="has_eighteen">
                                <Form.Label>Has eighteen</Form.Label>
                                <Form.Check
                                    name="has_eighteen"
                                    type="checkbox"
                                    {...formik.getFieldProps('has_eighteen')}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="interests">
                                <Form.Label>Interests</Form.Label>
                                <DropdownMultiselect
                                    name="interests"
                                    {...formik.getFieldProps('interests')}
                                    options={['first', 'second', 'third']}
                                />
                                {formik.touched.interests && formik.errors.interests ? (
                                    <Form.Text className="text-muted">
                                        {formik.errors.interests}
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