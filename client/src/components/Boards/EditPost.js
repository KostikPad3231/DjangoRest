import React, {useContext, useRef, useState} from 'react';
import {Button, Container, Form, Modal, Image, Card, Col, ListGroup, Breadcrumb} from 'react-bootstrap';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ReactImageUploading from 'react-images-uploading';
import Markdown from 'react-markdown';
import {editPost} from '../../api/requests';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {MessageContext} from '../MessageContext';
import {BOARD_TOPICS, BOARDS, TOPIC_POSTS} from '../../constants/routes';
import {Header} from '../Header';
import {Footer} from '../Footer';
import {MAX_POST_MESSAGE_LENGTH} from '../../constants';


const PostEditSchema = Yup.object({
    message: Yup.string()
        .required('Required')
        .max(MAX_POST_MESSAGE_LENGTH, `Must be less than ${MAX_POST_MESSAGE_LENGTH} characters`),
});


export const EditPost = ({user}) => {
    const {boardId, topicId, postId} = useParams();
    const location = useLocation();
    const {post, topicName, boardName} = location.state;
    let originalImages = post.photos;
    const [images, setImages] = useState(post.photos.map(photo => {
        return {photo: photo.file}
    }));
    const onRemoveAllImages = useRef(null);
    const [markdownText, setMarkdownText] = useState(post.message);
    const {newMessage} = useContext(MessageContext);
    const navigate = useNavigate();

    const onImageInputChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };
    return (
        <>
            <Header user={user}/>
            <Container>
                <Breadcrumb className="my-4 px-3 pt-3 d-flex rounded align-items-center"
                            style={{backgroundColor: '#e9ecef'}}>
                    <Breadcrumb.Item onClick={() => {
                        navigate(BOARDS);
                    }}>Boards</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => {
                        navigate(BOARDS + '/' + boardId, {state: {boardName}});
                    }}>{boardName}</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => {
                        navigate(BOARDS + '/' + boardId + '/' + topicId, {state: {boardName, topicName}});
                    }}>{topicName}</Breadcrumb.Item>
                    <Breadcrumb.Item active>Edit</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <div className="mx-auto" style={{width: '30rem'}}>
                <Card>
                    <Card.Body>
                        <Formik
                            initialValues={{
                                message: post.message,
                                photos: [],
                            }}
                            validationSchema={PostEditSchema}
                            onSubmit={async values => {
                                const photos = [];
                                images.forEach(image => {
                                    if (image.photo.startsWith('http')) {
                                        originalImages = originalImages.filter(e => {
                                            return e.file !== image.photo;
                                        });
                                    } else {
                                        photos.push(image);
                                    }
                                });
                                values.photos = photos.map(image => ({
                                    file: image.photo
                                }));
                                values.photos_to_delete = originalImages.map(image => image.id);
                                onRemoveAllImages.current();
                                try {
                                    const response = await editPost(post.id, values);
                                    setMarkdownText(response.data.message);
                                    setImages(response.data.photos.map(photo => {
                                        return {photo: photo.file}
                                    }));
                                    newMessage('Topic was edited successfully');
                                    navigate(BOARDS + '/' + boardId + '/' + topicId, {state: {boardName, topicName}});
                                } catch (e) {
                                    console.log(e);
                                    newMessage('Something went wrong', 'danger');
                                }
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
                                            return (
                                                <ListGroup>
                                                    <Card>
                                                        <Card.Header className="d-flex justify-content-between">
                                                            <Button variant="outline-primary" onClick={onImageUpload}>
                                                                Upload images
                                                            </Button>
                                                            <Button variant="outline-warning"
                                                                    onClick={onImageRemoveAll}>
                                                                Remove all images
                                                            </Button>

                                                        </Card.Header>
                                                        {imageList.map((image, index) => {
                                                            return <ListGroup.Item key={index} className="px-0 pt-3">
                                                                <Image fluid src={image.photo} alt="" height="100px"
                                                                       className="mb-3"/>
                                                                <div>
                                                                    <Button variant="outline-secondary"
                                                                            onClick={() => onImageUpdate(index)}>Update</Button>
                                                                    <Button variant="outline-danger"
                                                                            onClick={() => onImageRemove(index)}>Remove</Button>
                                                                </div>
                                                            </ListGroup.Item>
                                                        })}
                                                    </Card>
                                                </ListGroup>
                                            )
                                        }}
                                    </ReactImageUploading>

                                    <Button variant="primary" type="submit" className="mt-3">
                                        Edit
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>
            </div>
            <Footer/>
        </>
    )
};