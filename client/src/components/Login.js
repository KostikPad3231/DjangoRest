import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import {Form, Card, Button} from 'react-bootstrap';
import * as Yup from 'yup';
import {getLoginLink, login} from '../api/requests';
import {Link, useNavigate} from 'react-router-dom';

import {PROFILE} from '../constants/routes';
import * as path from '../constants/routes';

// TODO move it to constants
const MIN_PASSWORD_LENGTH = 8;

const LoginSchema = Yup.object({
    username: Yup.string()
        .required('Required'),
    password: Yup.string()
        .min(
            MIN_PASSWORD_LENGTH,
            `Password has to be no more than ${MIN_PASSWORD_LENGTH} characters`
        )
        .required('Required')
});

export const Login = () => {
    const navigate = useNavigate();
    const [twitterLoginLink, setTwitterLoginLink] = useState('');
    const [githubLoginLink, setGithubLoginLink] = useState('');
    const [googleLoginLink, setGoogleLoginLink] = useState('');
    const handleLogin = async values => {
        try {
            await login(values)
                .then(response => {
                    if (response.status === 200) {
                        localStorage.setItem('token', response.data.key);
                        navigate(PROFILE);
                    }
                })
                .catch(error => {
                    const errors = {};
                    const errorData = error.response.data;
                    for (const key in errorData) {
                        const element = errorData[key];
                        errors[key] = element.toString();
                    }
                    // TODO swal fire
                });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const fetchLink = async provider => {
            const response = await getLoginLink(provider);
            console.log(provider);
            console.log(response.data.url);
            if(provider === 'twitter'){
                setTwitterLoginLink(response.data.url);
            }
            else if(provider === 'github'){
                setGithubLoginLink(response.data.url);
            }
            else if(provider === 'google'){
                setGoogleLoginLink(response.data.url);
            }
        }
        fetchLink('twitter');
        fetchLink('github');
        fetchLink('google');
    }, []);

    return (
        <Card style={{width: '18rem'}} className="mx-auto">
            <Card.Body>
                <Formik
                    initialValues={{
                        username: '',
                        password: '',
                    }}
                    validationSchema={LoginSchema}
                    onSubmit={values => {
                        handleLogin(values);
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

                            <Form.Group className="mb-3" controlId="password">
                                <Form.Label>Password</Form.Label>
                                <Form.Control
                                    name="password"
                                    type="password"
                                    placeholder="Password"
                                    {...formik.getFieldProps('password')}
                                />
                                {formik.touched.password && formik.errors.password ? (
                                    <Form.Text className="text-muted">
                                        {formik.errors.password}
                                    </Form.Text>
                                ) : null}
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Submit
                            </Button>
                        </Form>
                    )}
                </Formik>
                <Link to={path.PASSWORD_RESET_EMAIL}>Forgot password</Link>
            </Card.Body>
            <Card.Footer>
                <a href={twitterLoginLink}>Login with Twitter</a>
                <a href={githubLoginLink}>Login with GitHub</a>
                <a href={googleLoginLink}>Login with Google</a>
            </Card.Footer>
        </Card>
    )
};