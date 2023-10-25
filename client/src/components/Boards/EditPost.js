import React, {useRef, useState} from 'react';
import {Button, Container, Form, Modal, Image, Card, Col, ListGroup} from 'react-bootstrap';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ReactImageUploading from 'react-images-uploading';
import Markdown from 'react-markdown';
import {editPost} from '../../api/requests';
import {useLocation} from 'react-router-dom';


const PostEditSchema = Yup.object({
    message: Yup.string()
        .required('Required'),
});


export const EditPost = ({user}) => {
    const location = useLocation();
    const {post} = location.state;
    let originalImages = post.photos;
    const [images, setImages] = useState(post.photos.map(photo => { return {photo: photo.file}}));
    const onRemoveAllImages = useRef(null);
    const [markdownText, setMarkdownText] = useState(post.message);

    const onImageInputChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };
    return (
        <Formik
            initialValues={{
                message: post.message,
                photos: [],
            }}
            validationSchema={PostEditSchema}
            onSubmit={async values => {
                const photos = [];
                images.forEach(image => {
                    console.log(image);
                    if(image.photo.startsWith('http')){
                        originalImages = originalImages.filter(e => {
                            return e.file !== image.photo;
                        });
                    }
                    else{
                        photos.push(image);
                    }
                });
                values.photos = photos.map(image => ({
                    file: image.photo
                }));
                values.photos_to_delete = originalImages.map(image => image.id);
                console.log(originalImages);
                console.log(images);
                console.log(values);
                onRemoveAllImages.current();
                const response = await editPost(post.id, values);
                setMarkdownText(response.data.message);
                setImages(response.data.photos.map(photo => {return {photo: photo.file}}));
                console.log(response);
            }}
        >
            {formik => (
                <Form noValidate onSubmit={formik.handleSubmit}>
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
                                        {imageList.map((image, index) => {
                                            return <ListGroup.Item key={index}>
                                                <Image fluid src={image.photo} alt="" height="100px"
                                                       className="mb-1"/>
                                                <div>
                                                    <Button variant="outline-secondary"
                                                            onClick={() => onImageUpdate(index)}>Update</Button>
                                                    <Button variant="outline-danger"
                                                            onClick={() => onImageRemove(index)}>Remove</Button>
                                                </div>
                                            </ListGroup.Item>
                                        })}
                                    </ListGroup>
                                </Card.Body>
                            </Card>
                        }}
                    </ReactImageUploading>

                    <Button variant="primary" type="submit" className="mt-3">
                        Edit
                    </Button>
                </Form>
            )}
        </Formik>
    )
};