import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {deleteBoard} from '../../../api/requests';


export const DeleteModal = ({show, setShow, board, handleDelete}) => {
    const handleClose = () => setShow(false);
    const handleDeleteBoard = () => {
        handleClose();
        handleDelete(board.id);
    };
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm board deletion</Modal.Title>
            </Modal.Header>
            {board && (
                <Modal.Body>
                    Are you sure you want to delete the board <strong>{board.name}</strong>?
                </Modal.Body>
            )}
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleDeleteBoard}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
};