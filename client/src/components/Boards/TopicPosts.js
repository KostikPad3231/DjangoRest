import React, {useEffect, useRef, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Container, Button, Card, Col, Carousel, Row, Image, Breadcrumb} from 'react-bootstrap'
import {getTopicPosts} from '../../api/requests';
import {Header} from '../Header';
import moment from 'moment';
import profileAvatar from '../../assets/profile-icon.png';
import Markdown from 'react-markdown';
import {BOARD_TOPICS, HOME, POST_CREATE, POST_EDIT} from '../../constants/routes';
import {Footer} from '../Footer';


const Pagination = ({paginator, curPage, fetchPosts, setCurPage}) => {
    console.log(paginator);
    const pageRange = [];
    for (let i = curPage - 3; i < curPage + 3; ++i) {
        if (i >= 0 && i < paginator.pageCount) {
            pageRange.push(i);
        }
    }
    return (
        <>
            {curPage > 0 ? (
                <li className="page-item">
                    <a className="page-link" onClick={() => {
                        setCurPage.current = 0;
                        fetchPosts(0);
                    }}>First</a>
                </li>
            ) : (
                <li className="page-item disabled">
                    <span className="page-link">First</span>
                </li>
            )}

            {paginator.previous ? (
                <li className="page-item">
                    <a className="page-link" onClick={() => {
                        setCurPage.current = curPage - 1;
                        fetchPosts(curPage - 1);
                    }}>Previous</a>
                </li>
            ) : (
                <li className="page-item disabled">
                    <span className="page-link">Previous</span>
                </li>
            )}

            {pageRange.map((page, i) => (
                page === curPage ? (
                    <li className="page-item active" key={i}>
                        <span className="page-link">
                          {curPage + 1}
                            <span className="visually-hidden-focusable">(current)</span>
                        </span>
                    </li>
                ) : (
                    <li className="page-item" key={i}>
                        <a className="page-link" onClick={() => {
                            setCurPage.current = page;
                            fetchPosts(page);
                        }}>{page + 1}</a>
                    </li>
                )
            ))}

            {paginator.next ? (
                <li className="page-item">
                    <a className="page-link" onClick={() => {
                        setCurPage.current = curPage + 1;
                        fetchPosts(curPage + 1);
                    }}>Next</a>
                </li>
            ) : (
                <li className="page-item disabled">
                    <span className="page-link">Next</span>
                </li>
            )}

            {curPage + 1 !== paginator.pageCount ? (
                <li className="page-item">
                    <a className="page-link" onClick={() => {
                        setCurPage.current = paginator.pageCount - 1;
                        fetchPosts(paginator.pageCount - 1);
                    }}>Last</a>
                </li>
            ) : (
                <li className="page-item disabled">
                    <span className="page-link">Last</span>
                </li>
            )}
        </>
    );
};


export const TopicPosts = (props) => {
    const location = useLocation();
    const {topic, board} = location.state;
    const curUser = props.user;
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchPageIndex = useRef(location.state.page ? location.state.page : 0);
    const fetchIdRef = useRef(0);
    const [hasMore, setHasMore] = useState(true);
    const [paginator, setPaginator] = useState(null);

    const fetchPosts = async (page = null) => {
        const fetchId = ++fetchIdRef.current;
        setLoading(true);
        try {
            const response = await getTopicPosts(topic.id, page ? page : fetchPageIndex.current);
            if (fetchId === fetchIdRef.current) {
                console.log(response);
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
        fetchPosts();
    }, []);

    return (
        // TODO add date to post
        <>
            <Header user={curUser}/>
            <Container>
                <Breadcrumb className="my-4 px-3 pt-3 d-flex rounded align-items-center" style={{backgroundColor: '#e9ecef'}}>
                    <Breadcrumb.Item onClick={() => {
                        navigate(HOME);
                    }}>Boards</Breadcrumb.Item>
                    <Breadcrumb.Item onClick={() => {
                        navigate(BOARD_TOPICS, {state: {...board}});
                    }}>{board.boardName}</Breadcrumb.Item>
                    <Breadcrumb.Item active>{topic.subject}</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <Container>
                <Button variant="success" onClick={() => navigate(POST_CREATE, {state: {topic: topic}})}>Reply</Button>
            </Container>
            <Container>
                {posts.map((post, i) => {
                    return <Card key={post.id}>
                        {i === 0 && (
                            <Card.Header style={{backgroundColor: "#212529"}} className="text-white">
                                {topic.subject}
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
                                    {curUser.id === post.created_by.id && (
                                        <Button className="align-self-end" type="button" onClick={() => {
                                            navigate(POST_EDIT, {state: {post: post}});
                                        }}>
                                            Edit
                                        </Button>
                                    )}
                                </div>
                            </Row>
                        </Card.Body>
                    </Card>
                })}
                {paginator && (paginator.previous || paginator.next) && (
                    <nav aria-label="Posts pagination" className="mb-4 d-flex">
                        <ul className="pagination mx-auto">
                            <Pagination paginator={paginator} curPage={fetchPageIndex.current - 1}
                                        fetchPosts={fetchPosts} setCurPage={fetchPageIndex}/>
                        </ul>
                    </nav>
                )}
            </Container>
            <Footer/>
        </>
    );
};