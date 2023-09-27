import React from 'react';
import {Formik, Form, Field} from 'formik';
import {Button} from 'reactstrap';
import {ReactstrapInput} from 'reactstrap-formik';

import {SignUpSchema} from './validation';

export const SignUpForm = props => (
    <Formik
        initialValues={{
            username: '',
            email: '',
            password1: '',
            password2: ''
        }}
        validationSchema={SignUpSchema}
        onSubmit={props.register}
    >
        {() => (
            <div className="card">
                <div className="card-header">Sign up</div>
                <div className="card-body">
                    <Form>
                        <Field
                            name="username"
                            type="text"
                            component={ReactstrapInput}
                            label="Name"
                        />
                        <Field
                            name="email"
                            type="email"
                            component={ReactstrapInput}
                            label="Email"
                        />
                        <Field
                            name="password1"
                            type="password"
                            component={ReactstrapInput}
                            label="Password"
                        />
                        <Field
                            name="password2"
                            type="password"
                            component={ReactstrapInput}
                            label="Password confirmation"
                        />
                        <Button type="submit">Submit</Button>
                    </Form>
                </div>
            </div>
        )}
    </Formik>
);