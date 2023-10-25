import React from 'react';
import {Button, Form, Modal} from 'react-bootstrap';
import {Formik} from 'formik';
import * as Yup from 'yup';


const BoardEditSchema = Yup.object({
    name: Yup.string()
        .required('Required'),
    description: Yup.string()
        .required('Required'),
});


export const EditBoardModal = ({show, setShow, board, handleEdit}) => {
    const handleClose = () => setShow(false);
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                {board && (
                    <Modal.Title>Edit board {board.name}</Modal.Title>
                )}
            </Modal.Header>
            <Modal.Body>
                {board && (
                    <Formik
                        initialValues={{
                            name: board.name,
                            description: board.description
                        }}
                        validationSchema={BoardEditSchema}
                        onSubmit={async values => {
                            handleClose();
                            handleEdit(board.id, values);
                        }}
                    >
                        {formik => (
                            <Form noValidate onSubmit={formik.handleSubmit}>
                                <Form.Group className="mb-3" controlId="name">
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
                                    Save
                                </Button>
                            </Form>
                        )}
                    </Formik>
                )}
            </Modal.Body>
        </Modal>
    )
};