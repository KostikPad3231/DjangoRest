import React, {useContext, useEffect, useRef, useState} from 'react';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import {Container, Table, Button, Breadcrumb} from 'react-bootstrap'
import {
    createBoard,
    createTopic,
    deleteTopic,
    exportTopicsCSV,
    exportTopicsPDF,
    getBoardTopics
} from '../../api/requests';
import {Header} from '../Header';
import moment from 'moment';

import InfiniteScroll from 'react-infinite-scroll-component';

import {AddCircleOutline, TrashOutline} from 'react-ionicons';
import {DeleteTopicModal} from './Modals/DeleteTopicModal';
import {CreateTopicModal} from './Modals/CreateTopicModal';
import * as path from '../../constants/routes';
import {HOME} from '../../constants/routes';
import {Footer} from '../Footer';
import {BsFiletypeCsv, BsFiletypePdf} from 'react-icons/bs';
import fileDownload from 'js-file-download';
import {MessageContext} from '../MessageContext';

export const BoardTopics = ({newMessage, user}) => {
    const [showDelete, setShowDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const location = useLocation();
    const {boardId, boardName} = location.state;
    const navigate = useNavigate();
    const [topics, setTopics] = useState([]);
    const [loading, setLoading] = useState(false);
    const fetchPageIndex = useRef(0);
    const fetchIdRef = useRef(0);
    const [hasMore, setHasMore] = useState(true);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const messages = useContext(MessageContext);
    console.log('board topics context');
    console.log(messages);

    const handleDelete = async () => {
        try {
            const response = await deleteTopic(selectedTopic.id);
            if (response.status === 204) {
                // newMessage(messages, setMessages, 'Topic was deleted successfully');
            }
            fetchPageIndex.current = 0;
            setTopics([]);
            setSelectedTopic(null);
            await fetchTopics();
        } catch (e) {
            console.log(e);
            // newMessage(messages, setMessages, 'Something went wrong', 'danger');
        }

    };
    const handleCreate = async (values) => {
        values.board = boardId;
        try {
            const response = await createTopic(values);
            if (response.status === 201) {
                // newMessage(messages, setMessages, 'Topic was created successfully');
            }
            fetchPageIndex.current = 0;
            setTopics([]);
            setSelectedTopic(null);
            await fetchTopics();
        } catch (e) {
            console.log(e);
            // newMessage(messages, setMessages, 'Something went wrong', 'danger');
        }
    };
    const handleShowDelete = (topic) => {
        setSelectedTopic(topic);
        setShowDelete(true);
    };
    const handleShowCreate = () => {
        setShowCreate(true);
    };
    const fetchTopics = async () => {
        const fetchId = ++fetchIdRef.current;
        setLoading(true);
        try {
            const response = await getBoardTopics(boardId, fetchPageIndex.current);
            console.log(response);
            if (fetchId === fetchIdRef.current) {
                setTopics(topics => topics.concat(response.data.results));
                setHasMore(!!response.data.next);
                setLoading(false);
                ++fetchPageIndex.current;
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    return (
        <>
            <Header user={user}/>
            <Container>
                <Breadcrumb className="my-4 px-3 pt-3 d-flex rounded align-items-center"
                            style={{backgroundColor: '#e9ecef'}}>
                    <Breadcrumb.Item onClick={() => {
                        navigate(HOME);
                    }}>Boards</Breadcrumb.Item>
                    <Breadcrumb.Item active>{boardName}</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <Container>
                <div className="d-flex mb-3">
                    <AddCircleOutline
                        color={'#00000'}
                        title="New"
                        height="50px"
                        width="50px"
                        onClick={handleShowCreate}
                        style={{cursor: 'pointer'}}
                        className="me-auto"
                    />
                    <BsFiletypeCsv size={50} cursor="pointer" onClick={async () => {
                        const response = await exportTopicsCSV(boardId);
                        const contentDisposition = response.headers['content-disposition'];
                        const filename = contentDisposition.split('"')[1];
                        console.log(response);
                        fileDownload(response.data, filename);
                        console.log(filename);
                    }}/>
                    <BsFiletypePdf size={50} className="ms-3" cursor="pointer" onClick={async () => {
                        const response = await exportTopicsPDF(boardId);
                        console.log(response);
                        const contentDisposition = response.headers['content-disposition'];
                        const filename = contentDisposition.split('"')[1];

                        fileDownload(response.data, filename);
                        console.log(filename);
                    }}/>
                </div>
                <InfiniteScroll
                    next={fetchTopics}
                    hasMore={hasMore}
                    loader={<h4>Loading...</h4>}
                    dataLength={topics.length}
                >
                    <Table bordered>
                        <thead className="table-dark">
                        <tr>
                            <th>Topic</th>
                            <th>Starter</th>
                            <th>Replies</th>
                            <th>Views</th>
                            <th>Last Update</th>
                            {user.is_blogger && (
                                <th></th>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        {topics.map((topic) => {
                            const pageRange = Array.isArray(topic.page_range) ? topic.page_range : [];
                            return <tr key={topic.id}>
                                <td>
                                    <p className="mb-0">
                                        <Link to={path.TOPIC_POSTS}
                                              state={{topic, board: {boardId, boardName}}}>
                                            {topic.subject}
                                        </Link>
                                    </p>
                                    <small className="text-muted">
                                        Pages:
                                        {/*TODO link to page*/}
                                        {pageRange.map((pageIndex, i) => (
                                            <Link key={i} to={path.TOPIC_POSTS}
                                                  state={{topic, board: {boardId, boardName}, page: pageIndex - 1}}>
                                                {pageIndex}
                                            </Link>
                                        ))}
                                        {/*TODO link to last page*/}
                                        {topic.has_many_pages && (
                                            <>... Last Page</>
                                        )}
                                    </small>
                                </td>
                                <td className="align-middle">{topic.starter}</td>
                                <td className="align-middle">{topic.replies}</td>
                                <td className="align-middle">{topic.views}</td>
                                {/*TODO make natural time*/}
                                <td className="align-middle">{topic.last_updated}</td>
                                {user.is_blogger && (
                                    <td>
                                        <Button variant="danger" onClick={() => handleShowDelete(topic)}>
                                            <TrashOutline
                                                color={'#000000'}
                                                title="Delete"
                                                height="25px"
                                                width="40px"
                                            />
                                            Delete
                                        </Button>
                                    </td>
                                )}
                            </tr>;
                        })}
                        </tbody>
                    </Table>

                </InfiniteScroll>
                <DeleteTopicModal show={showDelete} setShow={setShowDelete} topic={selectedTopic}
                                  handleDelete={handleDelete}/>
                <CreateTopicModal show={showCreate} setShow={setShowCreate} handleCreate={handleCreate}/>
            </Container>
            <Footer/>
        </>
    );
};