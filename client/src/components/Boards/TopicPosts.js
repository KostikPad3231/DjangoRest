import React, {useEffect, useRef, useState} from 'react';
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom';
import {Container, Button, Card, Col, Carousel, Row, Image, Breadcrumb} from 'react-bootstrap'
import {getTopicPosts} from '../../api/requests';
import {Header} from '../Header';
import moment from 'moment';
import profileAvatar from '../../assets/profile-icon.png';
import Markdown from 'react-markdown';
import {BOARD_TOPICS, BOARDS, POST_CREATE, POST_EDIT} from '../../constants/routes';
import {Footer} from '../Footer';
import {Paginator} from './Paginator';


export const TopicPosts = (props) => {
    const navigate = useNavigate();
    const {boardId, topicId} = useParams();
    const location = useLocation();
    const searchParams = new URLSearchParams(window.location.search);
    let boardName, topicName;
    if (location.state) {
        boardName = location.state.boardName;
        topicName = location.state.topicName;
    } else if (searchParams.get('boardName') && searchParams.get('topicName')) {
        boardName = searchParams.get('boardName');
        topicName = searchParams.get('topicName');
    }
    const curUser = props.user;
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchPageIndex = useRef(location.state && location.state.page ? location.state.page : 0);
    const fetchIdRef = useRef(0);
    const [hasMore, setHasMore] = useState(true);
    const [paginator, setPaginator] = useState(null);

    const fetchPosts = async (page = null) => {
        const fetchId = ++fetchIdRef.current;
        setLoading(true);
        try {
            const response = await getTopicPosts(topicId, page ? page : fetchPageIndex.current);
            if (fetchId === fetchIdRef.current) {
                setPaginator({
                    pageCount: Math.ceil(response.data.count / 10),
                    count: response.data.count,
                    next: response.data.next,
                    previous: response.data.previous,
                });
                setPosts(response.data.results);
                setHasMore(!!response.data.next);
                setLoading(false);
                ++fetchPageIndex.current;
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!location.state && !(searchParams.get('boardName') && searchParams.get('topicName'))) {
            navigate(BOARDS);
        }
        fetchPosts();
    }, []);

    return (
        <>
            <Header user={curUser}/>
            <Container>
                <Breadcrumb className="my-4 px-3 pt-3 d-flex rounded align-items-center"
                            style={{backgroundColor: '#e9ecef'}}>
                    <Breadcrumb.Item onClick={() => {
                        navigate(BOARDS);
                    }}>Boards</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => {
                        navigate(BOARDS + '/' + boardId, {state: {boardName}});
                    }}>{boardName}</Breadcrumb.Item>
                    <Breadcrumb.Item active>{topicName}</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <Container>
                <Button variant="success" onClick={() => navigate(BOARDS + '/' + boardId + '/' + topicId + '/create', {
                    state: {
                        topicName,
                        boardName
                    }
                })}>Reply</Button>
            </Container>
            <Container className="mt-3">
                {posts.map((post, i) => {
                    return <Card key={post.id}>
                        {i === 0 && (
                            <Card.Header style={{backgroundColor: "#212529"}} className="text-white">
                                {topicName}
                            </Card.Header>
                        )}
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
                                        <Carousel className="p-0 m-0 d-flex align-items-center" style={{
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
                        <Card.Footer className="d-flex justify-content-between">
                            <div>
                                {post.updated_at ? (
                                    <>
                                        Edited {moment(post.updated_at).fromNow()}
                                    </>
                                ) : (
                                    <>
                                        {moment(post.created_at).fromNow()}
                                    </>
                                )}
                            </div>
                            {curUser.id === post.created_by.id && (
                                <Button type="button" onClick={() => {
                                    navigate(BOARDS + '/' + boardId + '/' + topicId + '/' + post.id + '/edit', {
                                        state: {
                                            post,
                                            topicName,
                                            boardName
                                        }
                                    });
                                }}>
                                    Edit
                                </Button>
                            )}
                        </Card.Footer>
                    </Card>
                })}
                {paginator && (paginator.previous || paginator.next) && (
                    <nav aria-label="Posts pagination" className="mb-4 d-flex">
                        <ul className="pagination mx-auto">
                            <Paginator paginator={paginator} curPage={fetchPageIndex.current - 1}
                                       fetchPosts={fetchPosts} setCurPage={fetchPageIndex}/>
                        </ul>
                    </nav>
                )}
            </Container>
            <Footer/>
        </>
    );
};