import React from 'react';
import {MDBContainer, MDBModal} from 'mdb-react-ui-kit';
import {CloseCircleOutline} from 'react-ionicons';

const ModalForm = props => {
    const flex = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    };
    return (
        <MDBContainer>
            <MDBModal isOpen={props.isActive} toggle={props.closeModal}>
                <div className="card-body">
                    <div style={flex}>
                        <h3>{props.title}</h3>
                        <CloseCircleOutline
                            onClick={props.closeModal}
                            fontSize="30px"
                            color="#007bff"
                        />
                    </div>
                </div>
            </MDBModal>
        </MDBContainer>
    );
};

export default ModalForm;