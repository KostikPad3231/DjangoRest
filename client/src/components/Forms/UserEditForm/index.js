import React from 'react';
import {Formik, Form, Field} from 'formik';
import {MDBBtn} from 'mdb-react-ui-kit';
import {ReactstrapInput} from 'reactstrap-formik';

import {UserFormValidate} from './validation';

const UserEditForm = props => {
    return (
        <div className="col-lg-7 col-xlg-9 col-md-7">
            <Formik
                initialValues={props.initialValues}
                validationSchema={UserFormValidate}
                onSubmit={props.handleEditUser}
                enableReinitialize={true}
            >
                {() => (
                    <div className="card">
                        <div className="card-body">
                            <Form>
                                <Field
                                    name="username"
                                    type="text"
                                    component={ReactstrapInput}
                                    label="Username"
                                />
                                <Field
                                    name="email"
                                    type="text"
                                    component={ReactstrapInput}
                                    label="Email"
                                />
                                <div className="position-relative form-group">
                                    <label>Avatar</label>
                                    <input
                                        name="avatar"
                                        type="file"
                                        className="form-control-file"
                                        accept="image/*"
                                        onChange={props.handleImageChange}
                                        label="Avatar"
                                    />
                                    {props.error && (
                                        <div className="invalid-feedback d-block">
                                            {props.error}
                                        </div>
                                    )}
                                </div>
                                <MDBBtn color="primary" type="submit" style={{margin: 0}}>
                                    Save
                                </MDBBtn>
                            </Form>
                        </div>
                    </div>
                )}
            </Formik>
        </div>
    );
};

export default UserEditForm;