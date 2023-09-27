import React from 'react';
import {MDBCard} from 'mdb-react-ui-kit';
import {getUsers} from '../../api/queries/index';

class GetUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userCount: 0
        };
    }

    componentDidMount() {
        getUsers()
            .then(users => {
                this.setState({userCount: users.data ? users.data.length : 0});
            })
            .catch(error => console.log(error));
    }

    render() {
        const stylesOnCard = {width: '22rem', marginTop: '1rem'};
        return (
            <MDBCard className="card-body" style={stylesOnCard}>
                <h3>Users: {this.state.userCount}</h3>
            </MDBCard>
        );
    }
}

export default GetUsers;