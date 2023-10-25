import React from 'react';
import {Button, Modal} from 'react-bootstrap';
import {deleteBoard} from '../../../api/requests';


export const DeleteTopicModal = ({show, setShow, topic, handleDelete}) => {
    const handleClose = () => setShow(false);
    const handleDeleteTopic = () => {
        handleClose();
        handleDelete(topic.id);
    };
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Confirm topic deletion</Modal.Title>
            </Modal.Header>
            {topic && (
                <Modal.Body>
                    Are you sure you want to delete the topic <strong>{topic.subject}</strong>?
                </Modal.Body>
            )}
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="danger" onClick={handleDeleteTopic}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
};