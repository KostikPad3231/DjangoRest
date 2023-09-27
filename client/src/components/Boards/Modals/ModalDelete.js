import React from 'react';
import {MDBContainer, MDBModal, MDBBtn} from 'mdb-react-ui-kit';
import {CloseCircleOutline} from 'react-ionicons';

import './style.css';

const ModalDelete = ({isActive, closeModal, deleteBoard, id}) => (
    <MDBContainer>
        <MDBModal isOpen={isActive} toggle={closeModal}>
            <div className="wrapp-modal">
                <CloseCircleOutline
                    onClick={closeModal}
                    fontSize="80px"
                    color="red"
                />
                <h3>Are you sure?</h3>
                <h5>
                    Do you really want to delete these task ? This procces cannot be
                    undone.
                </h5>
            </div>
            <div className="modal-foot">
                <MDBBtn color="primary" onClick={closeModal}>
                    No
                </MDBBtn>
                <MDBBtn color="danger" onClick={() => deleteBoard(id)}>
                    Yes
                </MDBBtn>
            </div>
        </MDBModal>
    </MDBContainer>
);

export default ModalDelete;