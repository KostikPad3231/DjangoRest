import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {verifyToken, getMe} from '../api/queries';
import {useNavigate} from 'react-router-dom';

// export const isAuth = WrappedComponent => {
//     class Comp extends React.Component {
//         constructor(props) {
//             super(props);
//             this.state = {
//                 user: null
//             };
//         }
//
//         async componentDidMount() {
//             try {
//                 const response = await verifyToken();
//
//                 if (!response.data.verified) {
//                     this.props.history.push('/login')
//                 }
//
//                 const me = await getMe(localStorage.getItem(('token')));
//
//                 this.setState({user: me.data});
//             } catch (error) {
//                 console.log('error', error);
//             }
//         }
//
//         render() {
//             console.log(this.state.user);
//             return <WrappedComponent {...this.props} user={this.state.user}/>;
//         }
//     }
//
//     const mapStateToProps = state => ({
//         data: state.user
//     });
//     return connect(mapStateToProps, null)(Comp);
// };

export const isAuth = WrappedComponent => {
    const AuthComponent = ({history, user, ...props}) => {
        const [currentUser, setCurrentUser] = useState(null);
        const navigate = useNavigate();

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await verifyToken();

                    if (!response.data.verified) {
                        navigate('/login');
                        // history.push('/login');
                    } else {
                        const me = await getMe(localStorage.getItem('token'));

                        setCurrentUser(me.data);
                    }
                } catch (error) {
                    console.log('error', error);
                }
            };

            fetchData();
        });

        return <WrappedComponent {...props} user={currentUser}/>;
    };

    const mapStateToProps = state => ({
        data: state.user,
    });

    return connect(mapStateToProps, null)(AuthComponent);
};