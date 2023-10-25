import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Container, Table, Button, Modal, Breadcrumb, Row, Col, ListGroup, Card} from 'react-bootstrap'
import {getBoards, getMe} from '../../api/requests';
import {Header} from '../Header';
import {usePagination, useTable} from 'react-table';
import moment from 'moment';

import {DeleteModal} from './Modals/DeleteModal';

import {PencilOutline} from 'react-ionicons';
import {TrashOutline} from 'react-ionicons';

import {BoardsTable} from './BoardsTable';
import {BOARD_TOPICS} from '../../constants/routes';
import {Footer} from '../Footer';
import {Messages} from '../Messages';
import {MessageContext} from '../MessageContext';
// TODO update user after operations
export const Home = (props) => {
    const [user, setUser] = useState(props.user);
    const navigate = useNavigate();
    const [boards, setBoards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    const fetchIdRef = useRef(0);
    const [messages, setMessages] = useState([]);
    const newMessage = (text, variant = 'success') => {
        const message = {
            id: Date.now(),
            variant: variant,
            text: text,
        };

        setMessages([...messages, message]);

        setTimeout(() => {
            setMessages(messages => messages.filter(m => m.id !== message.id));
        }, 5000);
    };
    const fetchBoards = useCallback(async ({pageSize, pageIndex}) => {
        const fetchId = ++fetchIdRef.current;
        setLoading(true);
        try {
            const response = await getBoards(pageIndex);
            if (fetchId === fetchIdRef.current) {
                const responseMe = await getMe();
                setUser(responseMe.data);
                setBoards(response.data.results);
                setPageCount(Math.ceil(response.data.count / pageSize));
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
        }
    }, []);
    const columns = useMemo(() => [
        {
            Header: 'Board',
            accessor: 'name',
            Cell: ({cell}) => {
                const original_obj = cell.row.original;
                const name = original_obj.name;
                const description = original_obj.description;
                // TODO link to the board
                return <div>
                    <h5>{name}</h5>
                    <small className="text-muted d-block">{description}</small>
                </div>;
            }
        },
        {
            Header: 'Posts',
            accessor: 'posts_count',
            Cell: ({cell}) => {
                return cell.value ? cell.value : 0;
            }
        },
        {
            Header: 'Topics',
            accessor: 'topics_count'
        },
        {
            Header: 'Last Post',
            accessor: 'latest_post_id',
            Cell: ({cell}) => {
                const original_obj = cell.row.original;
                if (original_obj.latest_post_created_at) {
                    const created_by = original_obj.latest_post_created_by;
                    let created_at = original_obj.latest_post_created_at;
                    created_at = moment(created_at).format('MMM Do YYYY, h:mm a');
                    // TODO link to the post
                    return <small>
                        By {created_by} at {created_at}
                    </small>;
                }
                return <small>Nothing yet</small>;
            }
        },
    ], []);
    const data = useMemo(() => boards, [boards]);

    return (
        <MessageContext.Provider value={messages}>
            <Header user={user}/>
            <Container>
                <Breadcrumb className="my-4 px-3 pt-3 d-flex rounded align-items-center"
                            style={{backgroundColor: '#e9ecef'}}>
                    <Breadcrumb.Item active>Boards</Breadcrumb.Item>
                </Breadcrumb>
            </Container>
            <Container>
                <Row>
                    {user.is_blogger && (
                        <ListGroup className="col-sm-12 col-md-2 ms-3">
                            <Card>
                                <Card.Header>
                                    Recent actions
                                </Card.Header>
                                {user.last_actions.map((action, i) => {
                                    let action_tag = '';
                                    switch (action.action_tag) {
                                        case 'C':
                                            action_tag = 'success';
                                            break;
                                        case 'U':
                                            action_tag = 'warning';
                                            break;
                                        case 'D':
                                            action_tag = 'danger';
                                            break;
                                    }
                                    return <ListGroup.Item key={i} variant={action_tag}>
                                        {action.board_id ? (
                                            <>
                                                <Link to={BOARD_TOPICS}
                                                      state={{
                                                          boardId: action.board_id,
                                                          boardName: action.subject_name
                                                      }}>
                                                    {action.subject_name}
                                                </Link>
                                                <>
                                                    {' ' + action.message}
                                                </>
                                            </>
                                        ) : (
                                            <>
                                                {action.subject_name + ' ' + action.message}
                                            </>
                                        )}
                                    </ListGroup.Item>
                                })}
                            </Card>
                        </ListGroup>
                    )}
                    <Col>
                        <BoardsTable
                            newMessage={newMessage}
                            user={user}
                            columns={columns}
                            data={data}
                            fetchData={fetchBoards}
                            loading={loading}
                            pageCount={pageCount}
                        />
                    </Col>
                </Row>
            </Container>
            <Footer/>
            <Messages messages={messages}/>
        </MessageContext.Provider>
    );
};