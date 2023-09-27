import React from 'react';

import {Formik, Form, Field} from 'formik';
import {MDBBtn} from 'mdb-react-ui-kit';
import {ReactstrapInput} from 'reactstrap-formik';

import {BoardSchema} from './validation';

import './style.css';

const CreateBoardForm = props => (
    <Formik
        initialValues={{
            title: '',
            description: ''
        }}
        validationSchema={BoardSchema}
        onSubmit={props.submitForm}
    >
        {({values, setFieldValue, touched, errors}) => (
            <div className="card">
                <div className="card-body">
                    <Form>
                        <Field
                            name="title"
                            type="text"
                            component={ReactstrapInput}
                            label="Title"
                        />
                        <Field
                            name="description"
                            type="text"
                            component={ReactstrapInput}
                            label="Description"
                        />
                        {errors.assignedTo && touched.assignedTo && (
                            <div className="invalid-feedback" style={{display: "block"}}>
                                {errors.assignedTo}
                            </div>
                        )}
                        <br/>
                        <div>
                            <MDBBtn color="primary" type="submit" style={{margin: 0}}>
                                Save
                            </MDBBtn>
                        </div>
                    </Form>
                </div>
            </div>
        )}
    </Formik>
);

export default CreateBoardForm;