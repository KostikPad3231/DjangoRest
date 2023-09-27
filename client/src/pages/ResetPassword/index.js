import React from 'react';

import * as path from '../../constants/routes';
import {Container} from 'reactstrap';

import {ResetPasswordForm} from '../../components/Forms/ResetPasswordForm';
import {resetPassword} from '../../api/queries';
import Swal from 'sweetalert2';

const ResetPassword = ({history, match}) => {
    const handleResetPassword = async (values, {setErrors}) => {
        try {
            resetPassword(match.params.uid, match.params.confirmToken, values)
                .then(response => {
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: `${response.data.detail}`,
                            text: 'Good Job'
                        }).then(() => {
                            history.push(path.SIGN_IN);
                        });
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: `${response.data.detail}`,
                            text: 'Fail'
                        });
                        setErrors(response.data.detail);
                    }
                })
                .catch(error => {
                    if (error.response.data.token) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Invalid Token',
                            text: `${error.response.data.token.map(error => error)}`
                        });
                    } else if (error.response.data.new_password1) {
                        setErrors({
                            newPassword1: error.response.data.new_password1.map(
                                error => error
                            )
                        });
                    } else if (error.response.data.new_password2) {
                        setErrors({
                            new_password2: error.response.data.new_password2.map(
                                error => error
                            )
                        });
                    }
                });
        } catch (error) {
            return;
        }
    };

    return (
        <Container>
            <ResetPasswordForm
                resetPassword={handleResetPassword}
                uid={match.params.uid}
                confirmToken={match.params.confirmToken}
            />
        </Container>
    );
};

export default ResetPassword;