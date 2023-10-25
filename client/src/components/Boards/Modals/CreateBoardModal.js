import React from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {Formik} from 'formik';
import * as Yup from 'yup';


const BoardCreateSchema = Yup.object({
    name: Yup.string()
        .required('Required'),
    description: Yup.string()
        .required('Required'),
});


export const CreateBoardModal = ({show, setShow, handleCreate}) => {
    const handleClose = () => setShow(false);
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                    <Modal.Title>Create board</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                    <Formik
                        initialValues={{
                            name: '',
                            description: ''
                        }}
                        validationSchema={BoardCreateSchema}
                        onSubmit={async values => {
                            handleClose();
                            handleCreate(values);
                        }}
                    >
                        {formik => (
                            <Form noValidate onSubmit={formik.handleSubmit}>
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        name="name"
                                        type="text"
                                        placeholder="Name"
                                        {...formik.getFieldProps('name')}
                                    />
                                    {formik.touched.name && formik.errors.name ? (
                                        <Form.Text className="text-muted">
                                            {formik.errors.name}
                                        </Form.Text>
                                    ) : null}
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        name="description"
                                        type="text"
                                        placeholder="Description"
                                        {...formik.getFieldProps('description')}
                                    />
                                    {formik.touched.description && formik.errors.description ? (
                                        <Form.Text className="text-muted">
                                            {formik.errors.description}
                                        </Form.Text>
                                    ) : null}
                                </Form.Group>

                                <Button variant="primary" type="submit">
                                    Create
                                </Button>
                            </Form>
                        )}
                    </Formik>
            </Modal.Body>
        </Modal>
    )
};