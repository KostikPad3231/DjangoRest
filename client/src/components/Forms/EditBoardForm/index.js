import React from 'react';

import {Formik, Form, Field} from 'formik';
import {MDBBtn} from 'mdb-react-ui-kit';
import {ReactstrapInput} from 'reactstrap-formik';

import {BoardSchema} from '../CreateBoardForm/validation';
import '../CreateBoardForm/style.css';

const EditBoardForm = props => (
    <Formik
        initialValues={{
            title: props.name,
            description: props.description
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

export default EditBoardForm;