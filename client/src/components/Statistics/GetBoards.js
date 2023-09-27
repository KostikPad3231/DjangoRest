import React from 'react';
import {MDBCard, MDBCardText} from 'mdb-react-ui-kit';
import {getBoard} from '../../api/queries/index';

class GetBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            boards: []
        };
    }

    async componentDidMount() {
        await getBoard(true)
            .then(board => {
                this.setState({boards: board.data})
            })
            .catch(error => console.log(error));
    }

    render() {
        const stylesOnCard = {width: "22rem", marginTio: "1rem"};
        const boards = this.state.boards;
        return (
            <div>
                <div>
                    <MDBCard className="card-body" style={stylesOnCard}>
                        <h3>Boards: {boards ? boards.length : 0}</h3>
                    </MDBCard>
                </div>
            </div>
        );
    }
}

export default GetBoard;