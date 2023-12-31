import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, Container, Form, Modal, Image, Card, Col, ListGroup, Row, Carousel, Breadcrumb} from 'react-bootstrap';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ReactImageUploading from 'react-images-uploading';
import Markdown from 'react-markdown';
import {createPost, editPost, getLastTopicPosts} from '../../api/requests';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import {BOARD_TOPICS, BOARDS, POST_EDIT, TOPIC_POSTS} from '../../constants/routes';
import profileAvatar from '../../assets/profile-icon.png';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import {Header} from '../Header';
import {Footer} from '../Footer';
import {MAX_POST_MESSAGE_LENGTH} from '../../constants';

const PostCreateSchema = Yup.object({
    message: Yup.string()
        .required('Required')
        .max(MAX_POST_MESSAGE_LENGTH, `Must be less than ${MAX_POST_MESSAGE_LENGTH} characters`),
});


export const CreatePost = ({user}) => {
    const {topicId, boardId} = useParams();
    const [value, setValue] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const {topicName, boardName} = location.state;
    const [posts, setPosts] = useState([]);
    const [images, setImages] = useState([]);
    const onRemoveAllImages = useRef(null);
    const [markdownText, setMarkdownText] = useState('');
    const onImageInputChange = (imageList, addUpdateIndex) => {
        setImages(imageList);
    };
    useEffect(() => {
        const fetchPosts = async () => {
            const response = await getLastTopicPosts(topicId);
            setPosts(response.data);
        };
        fetchPosts();
    }, []);
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
                        navigate(BOARDS + '/' + boardId + '/' + topicId, {state: {boardName, topicName}})
                    }}>{topicName}</Breadcrumb.Item>
                    <Breadcrumb.Item active>Reply</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <Container>
                <Card>
                    <Card.Body>
                        <Formik
                            initialValues={{
                                message: '',
                                photos: [],
                            }}
                            validationSchema={PostCreateSchema}
                            onSubmit={async values => {
                                values.photos = images.map(image => ({
                                    file: image.photo
                                }));
                                values.topic_id = topicId;
                                const response = await createPost(topicId, values);
                                onRemoveAllImages.current();
                                setMarkdownText('');
                                navigate(BOARDS + '/' + boardId + '/' + topicId, {state: {boardName, topicName}});
                            }}
                        >
                            {formik => (
                                <Form noValidate onSubmit={formik.handleSubmit}>

                                    <Form.Group className="mb-3" controlId="message">
                                        <Form.Label>Message</Form.Label>
                                        <SimpleMDE value={value} onChange={(value) => {
                                            setValue(value);
                                            formik.values.message = value;
                                        }}/>
                                        <Form.Control
                                            hidden
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
                                            <Markdown>{value}</Markdown>
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
                                        Reply
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>

                {posts.map((post, i) => {
                    return <Card key={post.id}>
                        <Card.Body>
                            <Row>
                                <div className="col-2">
                                    <Row className="ms-1">
                                        {post.created_by.avatar ? (
                                            <Image fluid src={post.created_by.avatar.file} alt="avatar"
                                                   className="ps-0"/>
                                        ) : (
                                            <Image fluid src={profileAvatar} alt="avatar"/>
                                        )}
                                    </Row>
                                    <Row className="ms-1">
                                        {post.created_by.username}
                                    </Row>
                                    <Row className="ms-1">
                                        Posts: {post.created_by.posts_count}
                                    </Row>
                                </div>
                                <Col>
                                    <Markdown>{post.message}</Markdown>
                                </Col>
                                <div className="col-3 d-flex flex-column">
                                    {!!post.photos.length && (
                                        <Carousel className="p-0 m-0 pr-3 d-flex align-items-center" style={{
                                            minHeight: '150px',
                                            maxHeight: '200px',
                                            maxWidth: '300px',
                                            backgroundColor: 'black'
                                        }} interval={null}>
                                            {post.photos.map((photo, i) => (
                                                <Carousel.Item key={i}>
                                                    <img src={photo.file} alt="post" style={{
                                                        maxHeight: '200px',
                                                        width: '100%'
                                                    }}/>
                                                </Carousel.Item>
                                            ))}
                                        </Carousel>
                                    )}
                                </div>
                            </Row>
                        </Card.Body>
                    </Card>
                })}

            </Container>
            <Footer/>
        </>
    )
};