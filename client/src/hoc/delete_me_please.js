import {usePagination, useTable} from 'react-table';
import React, {useEffect, useState} from 'react';
import {Button, Table} from 'react-bootstrap';
import {PencilOutline, TrashOutline, AddCircleOutline} from 'react-ionicons';

import {DeleteModal} from './Modals/DeleteModal';
import {EditBoardModal} from './Modals/EditBoardModal';
import {CreateBoardModal} from './Modals/CreateBoardModal';

import {deleteBoard} from '../../api/requests';
import {editBoard} from '../../api/requests';
import {createBoard} from '../../api/requests';
import {Link} from 'react-router-dom';
import {BoardTopics} from './BoardTopics';
import {BOARD_TOPICS} from '../../constants/routes';
import {Messages} from '../Messages';
import {newMessage} from '../../utils/newMessage';

export const BoardsTable = ({user, columns, data, fetchData, loading, pageCount: controlledPageCount}) => {
    const [showDelete, setShowDelete] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [messages, setMessages] = useState([]);
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: {pageIndex, pageSize}
    } = useTable({
            columns,
            data,
            initialState: {pageIndex: 0},
            manualPagination: true,
            pageCount: controlledPageCount,
        },
        usePagination);

    const handleDelete = async (boardId) => {
        const response = await deleteBoard(boardId);
        if (response.status === 204) {
            newMessage(messages, setMessages, 'Board was deleted successfully');
        }
        if (page.length === 1 && pageIndex > 0) {
            gotoPage(pageIndex - 1);
        } else {
            fetchData({pageIndex, pageSize});
        }

    };
    const handleEdit = async (boardId, values) => {
        try {
            const response = await editBoard(boardId, values);
            if (response.status === 201) {
                newMessage(messages, setMessages, 'Board was updated successfully');
            }
            fetchData({pageIndex, pageSize});
        } catch (e) {
            console.log(e);
            if (e.response.status === 400) {
                newMessage(messages, setMessages, e.response.data.name[0], 'danger');
            } else {
                newMessage(messages, setMessages, 'Something went wrong', 'danger');
            }
        }
    };
    const handleCreate = async (values) => {
        try {
            const response = await createBoard(values);
            if (response.status === 201) {
                newMessage(messages, setMessages, 'Board was created successfully');
            }
            fetchData({pageIndex, pageSize});
        } catch (e) {
            console.log(e);
            if (e.response.status === 400) {
                newMessage(messages, setMessages, e.response.data.name[0], 'danger');
            } else {
                newMessage(messages, setMessages, 'Something went wrong', 'danger');
            }
        }
    }
    const handleShowDelete = (board) => {
        setSelectedBoard(board);
        setShowDelete(true);
    };
    const handleShowEdit = (board) => {
        setSelectedBoard(board);
        setShowEdit(true);
    };
    const handleShowCreate = () => {
        setShowCreate(true);
    }

    useEffect(() => {
        fetchData({pageIndex, pageSize});
    }, [fetchData, pageIndex, pageSize]);

    return (
        <>
            <AddCircleOutline
                color={'#00000'}
                title="New"
                height="50px"
                width="50px"
                onClick={handleShowCreate}
                style={{cursor: 'pointer'}}
            />
            <Table bordered hover className="text-center align-middle" {...getTableProps()}>
                <thead className="table-dark">
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>
                                {column.render('Header')}
                            </th>
                        ))}
                        {user.is_blogger && (
                            <>
                                <th></th>
                                <th></th>
                            </>
                        )}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr{...row.getRowProps()}>
                            {row.cells.map((cell) => {
                                if (cell.column.Header === 'Board') {
                                    return <td className="col" {...cell.getCellProps()}>
                                        <Link to={BOARD_TOPICS}
                                              state={{
                                                  boardId: row.original.id,
                                                  boardName: row.original.name,
                                              }}>
                                            {cell.render("Cell")}
                                        </Link>
                                    </td>
                                } else if (cell.column.Header === 'Last Post') {
                                    return <td className="col-3" {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                }
                                return <td className="col-1" {...cell.getCellProps()}>{cell.render("Cell")}</td>
                            })}
                            {user.is_blogger && (
                                <>
                                    <td className="col-1">
                                        <Button variant="warning" onClick={() => handleShowEdit(row.original)}>
                                            <PencilOutline
                                                color={'#000000'}
                                                title="Edit"
                                                height="25px"
                                                width="40px"
                                            />
                                            Edit
                                        </Button>
                                    </td>
                                    <td className="col-1">
                                        <Button variant="danger" onClick={() => handleShowDelete(row.original)}>
                                            <TrashOutline
                                                color={'#000000'}
                                                title="Delete"
                                                height="25px"
                                                width="40px"
                                            />
                                            Delete
                                        </Button>
                                    </td>
                                </>
                            )}
                        </tr>
                    )
                })}
                <tr>
                    {loading ? (
                        <td colSpan="10000">Loading...</td>
                    ) : (
                        <td colSpan="10000">
                            Showing {page.length} of ~{controlledPageCount * pageSize}{' '} results
                        </td>
                    )}
                </tr>
                </tbody>
            </Table>

            <div className="pagination">
                <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                <button onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>
                <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>
                <span>
                    Go to page:{' '}
                    <input
                        type="number"
                        defaultValue={pageIndex + 1}
                        onChange={e => {
                            const page = e.target.value ? Number(e.target.value) - 1 : 0
                            gotoPage(page)
                        }}
                        style={{width: '100px'}}
                    />
                </span>
            </div>

            <DeleteModal show={showDelete} setShow={setShowDelete} board={selectedBoard} handleDelete={handleDelete}/>
            <EditBoardModal show={showEdit} setShow={setShowEdit} board={selectedBoard} handleEdit={handleEdit}/>
            <CreateBoardModal show={showCreate} setShow={setShowCreate} handleCreate={handleCreate}/>
            <Messages messages={messages}/>
        </>
    );
};