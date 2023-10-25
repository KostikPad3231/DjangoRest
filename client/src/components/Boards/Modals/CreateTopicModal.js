import React, {useRef, useState} from 'react';
import {Button, Container, Form, Modal, Image, Card, Col, ListGroup} from 'react-bootstrap';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ReactImageUploading from 'react-images-uploading';
import Markdown from 'react-markdown';


const TopicCreateSchema = Yup.object({
    subject: Yup.string()
        .required('Required'),
    message: Yup.string()
        .required('Required'),
});


export const CreateTopicModal = ({show, setShow, handleCreate}) => {
    const handleClose = () => setShow(false);
    const [images, setImages] = useState([]);
    const onRemoveAllImages = useRef(null);
    const [markdownText, setMarkdownText] = useState('');
    const onImageInputChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create topic</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Formik
                    initialValues={{
                        subject: '',
                        message: '',
                        photos: [],
                    }}
                    validationSchema={TopicCreateSchema}
                    onSubmit={async values => {
                        values.photos = images.map(image => ({
                            file: image.photo
                        }));
                        handleClose();
                        onRemoveAllImages.current();
                        handleCreate(values);
                        setMarkdownText('');
                    }}
                >
                    {formik => (
                        <Form noValidate onSubmit={formik.handleSubmit}>
                            <Form.Group className="mb-3" controlId="subject">
                                <Form.Label>Subject</Form.Label>
                                <Form.Control
                                    name="subject"
                                    type="text"
                                    placeholder="Subject"
                                    {...formik.getFieldProps('subject')}
                                />
                                {formik.touched.subject && formik.errors.subject ? (
                                    <Form.Text className="text-muted">
                                        {formik.errors.subject}
                                    </Form.Text>
                                ) : null}
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="message">
                                <Form.Label>Message</Form.Label>
                                <Form.Control
                                    name="message"
                                    type="text"
                                    as="textarea"
                                    placeholder="Message"
                                    {...formik.getFieldProps('message')}
                                    onChange={e => {
                                        formik.handleChange(e);
                                        const newValue = e.currentTarget.value;
                                        setMarkdownText(newValue);
                                    }}
                                />
                                {formik.touched.message && formik.errors.message ? (
                                    <Form.Text className="text-muted">
                                        {formik.errors.message}
                                    </Form.Text>
                                ) : null}
                                <div className="mt-3 mb-2">Preview</div>
                                <Container className="border rounded">
                                    <Markdown>{markdownText}</Markdown>
                                </Container>
                            </Form.Group>

                            <ReactImageUploading
                                multiple
                                value={images}
                                onChange={onImageInputChange}
                                dataURLKey="photo"
                                acceptType={['jpg', 'png', 'jpeg']}
                            >
                                {({
                                      imageList,
                                      onImageUpload,
                                      onImageRemoveAll,
                                      onImageUpdate,
                                      onImageRemove,
                                  }) => {
                                    onRemoveAllImages.current = onImageRemoveAll;
                                    return <Card>
                                        <Card.Header className="d-flex justify-content-between">
                                            <Button variant="outline-primary" onClick={onImageUpload}>
                                                Upload images
                                            </Button>
                                            <Button variant="outline-warning" onClick={onImageRemoveAll}>
                                                Remove all images
                                            </Button>

                                        </Card.Header>
                                        <Card.Body>
                                            <ListGroup>
                                                {imageList.map((image, index) => (
                                                    <ListGroup.Item key={index}>
                                                        <Image fluid src={image.photo} alt="" height="100px"
                                                               className="mb-1"/>
                                                        <div>
                                                            <Button variant="outline-secondary"
                                                                    onClick={() => onImageUpdate(index)}>Update</Button>
                                                            <Button variant="outline-danger"
                                                                    onClick={() => onImageRemove(index)}>Remove</Button>
                                                        </div>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </Card.Body>
                                    </Card>
                                }}
                            </ReactImageUploading>

                            <Button variant="primary" type="submit" className="mt-3">
                                Create
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Modal.Body>
        </Modal>
    )
};