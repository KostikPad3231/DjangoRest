import React, {useContext, useState} from 'react';
import {Formik} from 'formik';
import {Form, Card, Button} from 'react-bootstrap';
import DropdownMultiselect from 'react-multiselect-dropdown-bootstrap';
import * as Yup from 'yup';
import {signUp} from '../../api/requests';
import {Link, useLocation} from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';

import * as path from '../../constants/routes';
import {Header} from '../Header';
import {Footer} from '../Footer';
import {MessageContext} from '../MessageContext';
import {MIN_PASSWORD_LENGTH} from '../../constants';

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
        ),
    captcha: Yup.string()
        .required('Required')
});

export const SignUpReader = () => {
    const location = useLocation();
    const {categories} = location.state;
    const [errors, setErrors] = useState({});
    const {newMessage} = useContext(MessageContext);
    return (
        <>
            <Header/>
            <Card className="mx-auto my-3">
                <Card.Header>
                    <h3>Sign up as a reader</h3>
                    {errors.non_field_errors && (
                        <p className="link-danger">{errors.non_field_errors}</p>
                    )}
                </Card.Header>
                <Card.Body>
                    <Formik
                        initialValues={{
                            username: '',
                            email: '',
                            password1: '',
                            password2: '',
                            has_eighteen: false,
                            interests: [],
                            captcha: null,
                        }}
                        validationSchema={ReaderRegisterSchema}
                        onSubmit={async values => {
                            try {
                                const response = await signUp('reader', values)
                                if (response.status === 201 && response.data.detail === 'Verification e-mail sent.') {
                                    newMessage('Verification email sent');
                                }
                            } catch (error) {
                                console.log(error);
                                const errors = {};
                                const errorData = error.response.data;
                                for (const key in errorData) {
                                    const element = errorData[key];
                                    errors[key] = element.toString();
                                }
                                setErrors(errors);
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
                                    {(formik.touched.username && formik.errors.username) || errors.username ? (
                                        <>
                                            <Form.Text className="text-muted">
                                                {formik.errors.username}
                                            </Form.Text>
                                            <Form.Text className="text-muted">
                                                {errors.username}
                                            </Form.Text>
                                        </>
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
                                    {(formik.touched.email && formik.errors.email) || errors.email ? (
                                        <>
                                            <Form.Text className="text-muted">
                                                {formik.errors.email}
                                            </Form.Text>
                                            <Form.Text className="text-muted">
                                                {errors.email}
                                            </Form.Text>
                                        </>
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
                                    {(formik.touched.password1 && formik.errors.password1) || errors.password1 ? (
                                        <>
                                            <Form.Text className="text-muted">
                                                {formik.errors.password1}
                                            </Form.Text>
                                            <Form.Text className="text-muted">
                                                {errors.password1}
                                            </Form.Text>
                                        </>
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
                                    {(formik.touched.password2 && formik.errors.password2) || errors.password2 ? (
                                        <>
                                            <Form.Text className="text-muted">
                                                {formik.errors.password2}
                                            </Form.Text>
                                            <Form.Text className="text-muted">
                                                {errors.password2}
                                            </Form.Text>
                                        </>
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
                                        options={categories.map(category => category.name)}
                                    />
                                    {formik.touched.interests && formik.errors.interests ? (
                                        <Form.Text className="text-muted">
                                            {formik.errors.interests}
                                        </Form.Text>
                                    ) : null}
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <ReCAPTCHA
                                        sitekey="6LcFwbYnAAAAAOWfXqUrBN-uvDdPgGbJmEwVjocz"
                                        onChange={(value) => {
                                            formik.setFieldValue('captcha', value);
                                        }}
                                    />
                                    {(formik.touched.captcha && formik.errors.captcha) || errors.captcha ? (
                                        <>
                                            <Form.Text className="text-muted">
                                                {formik.errors.captcha}
                                            </Form.Text>
                                            <Form.Text className="text-muted">
                                                {errors.captcha}
                                            </Form.Text>
                                        </>
                                    ) : null}
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Submit
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Card.Body>
                <Card.Footer>
                    Already have an account? <Link to={path.SIGN_IN}>Log in</Link>
                </Card.Footer>
            </Card>
            <Footer/>
        </>
    )
};