import React, {Fragment} from 'react';

import Modal from '../../Forms/ModalForm';
import CreateBoardForm from '../../Forms/CreateBoardForm';
import EditBoardForm from '../../Forms/EditBoardForm';
import ModalDelete from './ModalDelete';

const Modals = ({
                    modalCreate,
                    modalEdit,
                    modalDelete,
                    handleActiveModal,
                    handleCreateBoard,
                    handleUpdateBoard,
                    deleteBoard,
                    board,
                    id,
                    user
                }) => (
    <Fragment>
        <Modal
            isActive={modalCreate}
            title="Create board"
            closeModal={() => handleActiveModal('modalCreate')}
            user={user}
        >
            <CreateBoardForm
                submitForm={handleCreateBoard}
                {...board}
                user={user}
            />
        </Modal>
        <Modal
            isActive={modalEdit}
            title="Edit board"
            closeModal={() => handleActiveModal('modalEdit')}
            user={user}
        >
            <EditBoardForm
                submitForm={handleUpdateBoard}
                {...board}
                user={user}
            />
        </Modal>
        <ModalDelete
            isActive={modalDelete}
            closeModal={() => handleActiveModal('modalDelete')}
            deleteBoard={deleteBoard}
            id={id}
        />
    </Fragment>
);

export default Modals;