import React from 'react';
import {connect} from 'react-redux';
import {getCurrentDate} from '../../../utils';
import TableHeader from '../../../components/Boards/BoardTable/TableHeader';
import BoardTable from '../../../components/Boards/BoardTable';
import Modals from '../../../components/Boards/Modals';

import 'react-table-v6/react-table.css';
import '../../../index.css';
import Swal from 'sweetalert2';

import {setTask} from '../../../actions';
import {PAGINATION} from '../../../constants';
import {isAuth} from '../../../hoc/isAuth';
import {
    getUsers,
    getBoard,
    createBoard,
    deleteBoard,
    updateBoard
} from '../../../api/queries';
import {getTTFB} from 'web-vitals';

class Boards extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modalDelete: false,
            modalEdit: false,
            modalCreate: false,
            page: 1,
            pages: 1,
            date: '',
            user: [],
            boards: {
                name: '',
                description: ''
            },
            id: ''
        };
    }

    componentDidMount() {
        getBoard(false, 1).then((response) => {
            this.props.dispatch(setTask(response.data.results));
            this.setState({
                pages: Math.ceil(response.data.count / PAGINATION)
            });
        });
        getUsers().then((response) => {
            this.setState({
                user: response.data.map((user) => ({id: user.id, email: user.email}))
            });
        });
    }

    handleSwitchModal = (type, board) => {
        this.setState((state) => ({
            [type]: !state[type],
            board: board,
            id: board.id
        }));
    };

    handleActiveModal = (type) => {
        this.setState((state) => ({
            [type]: !state[type]
        }));
    };

    handleCreateBoard = (values, {setErrors}) => {
        try {
            createBoard({...values})
                .then((response) => {
                    if (response.status === 201) {
                        getBoard(false, this.state.page).then((response) => {
                            this.setState({
                                pages: Math.ceil(response.data.count / PAGINATION)
                            });
                            this.props.dispatch(setTask(response.data.results));
                        });
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: `${error.response}`,
                        text: 'Please try again'
                    });
                });
            this.setState({modalCreate: false});
        } catch (error) {
            return setErrors(error);
        }
    };

    handleUpdateBoard = (values, {setErrors}) => {
        const {id} = this.state;
        console.log(values);
        try {
            updateBoard(id, {...values})
                .then((response) => {
                    if (response.status === 200) {
                        getBoard(false, this.state.page).then((response) => {
                            this.props.dispatch(setTask(response.data.results));
                        });
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: `${error.response}`,
                        text: 'Please try again'
                    });
                });
            this.setState({modalEdit: false});
        } catch (error) {
            return setErrors(error);
        }
    };

    handleDeleteBoard = async ({setErrors}) => {
        const {id} = this.state;
        try {
            let page = this.state.page;
            deleteBoard(id)
                .then((response) => {
                    if (response.status === 204) {
                        if (this.props.boards.data.length > 1) {
                            getBoard(false, page).then((response) => {
                                this.setState({
                                    pages: Math.ceil(response.data.count / PAGINATION)
                                });
                                this.props.dispatch(setTask(response.data.results));
                            });
                        } else {
                            page -= 1;
                            if (page !== 0) {
                                getBoard(false, page).then((response) => {
                                    this.setState({
                                        pages: Math.ceil(response.data.count / PAGINATION),
                                        page: page
                                    });
                                    this.props.dispatch(setTask(response.data.results));
                                });
                            } else {
                                getBoard(false, 1).then((response) => {
                                    this.setState({
                                        pages: Math.ceil(response.data.count / PAGINATION),
                                        page: 1
                                    });
                                    this.props.dispatch(setTask(response.data.results));
                                });
                            }
                        }
                    }
                })
                .catch((error) => {
                    Swal.fire({
                        icon: 'error',
                        title: `${error.response}`,
                        text: 'Please try again'
                    });
                });
            this.setState({modalDelete: false});
        } catch (error) {
            setErrors(error);
            return false;
        }
    };

    fetchData = (item) => {
        const page = this.state.page;
        this.setState({
            page: item === 'prev' ? page - 1 : page + 1
        });
        getBoard(false, item === 'prev' ? page - 1 : page + 1)
            .then((response) => {
                this.props.dispatch(setTask(response.data.results));
            })
            .catch((error) => {
                Swal.fire({
                    icon: 'error',
                    title: `${error.response}`,
                    text: 'Please try again'
                });
            });
    };

    render() {
        const {
            modalCreate,
            modalEdit,
            modalDelete,
            page,
            pages,
            board,
            id
        } = this.state;
        return (
            <div>
                <TableHeader
                    title="Board list"
                    modalCreate={() => this.handleActiveModal('modalCreate')}
                />
                <BoardTable
                    boards={this.props.tasks.data}
                    fetchData={this.fetchData}
                    page={page}
                    pages={pages}
                    modal={this.handleSwitchModal}
                />
                <Modals
                    modalCreate={modalCreate}
                    modalEdit={modalEdit}
                    modalDelete={modalDelete}
                    handleActiveModal={this.handleActiveModal}
                    handleCreateBoard={this.handleCreateBoard}
                    handleUpdateBoard={this.handleUpdateBoard}
                    deleteBoard={this.handleDeleteBoard}
                    board={board}
                    user={this.state.user}
                    id={id}
                />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        boards: state.boards
    };
}

export default connect(mapStateToProps)(isAuth(Boards));