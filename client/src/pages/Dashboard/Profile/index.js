import React from 'react';

import UserProfile from '../../../components/UserProfile';
import UserEditForm from '../../../components/Forms/UserEditForm';
import {getBase64} from '../../../utils';

import {isAuth} from '../../../hoc/isAuth';

import {editProfile, getMe} from '../../../api/queries';

class EditUser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            avatar: '',
            user: null,
            imageError: null
        };
    }

    async componentDidMount() {
        try {
            const response = await getMe(localStorage.getItem('token'));
            console.log(response);
            this.setState({user: response.data});
        } catch (error) {
            console.log('error', error);
        }
    }

    handleImageChange = (e) => {
        if (!e.target.files) {
            return;
        }
        let file = e.target.files[0];
        if (file.size <= 1048576) {
            getBase64(file)
                .then((image) => (file = image))
                .then(() => this.getState({avatar: file, imageError: null}));
        }
        this.setState({avatar: file, imageError: null});
        return this.setState({imageError: 'max size 1MB'});
    };

    handleEditUser = (values, {setErrors}) => {
        try {
            editProfile({
                username: values.username,
                email: values.email,
                avatar: this.state.avatar
            });
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        const user = this.props.user;
        return (
            <div className="row">
                <UserProfile profile={user} avatar={this.state.avatar}/>
                <UserEditForm
                    initialValues={user}
                    handleEditUser={this.handleEditUser}
                    handleImageChange={this.handleImageChange}
                    error={this.state.imageError}
                />
            </div>
        );
    };
}

export default isAuth(EditUser);