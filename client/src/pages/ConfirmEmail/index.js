import React from 'react';
import {Container} from 'reactstrap';

import * as path from '../../constants/routes'

import {ConfirmEmailForm} from '../../components/Forms/ConfirmEmailForm/index';

import {confirmEmail} from '../../api/queries/index';
import Swal from 'sweetalert2';

const ConfirmEmail = ({history}) => {
    const handleConfirmEmail = async (values, {setErrors}) => {
        try {
            await confirmEmail(values)
                .then(response => {
                    if (response.status === 200) {
                        Swal.fire({
                            icon: 'success',
                            title: `${response.data.detail}`,
                            text: 'Good Job'
                        }).then(() => {
                            history.push(path.HOME);
                        });
                    } else {
                        setErrors(response.data.detail);
                    }
                })
                .catch(error => setErrors(error.response));
        } catch (error) {
            return;
        }
    };

    return (
        <Container>
            <ConfirmEmailForm confirmEmail={handleConfirmEmail}/>
        </Container>
    );
}

export default ConfirmEmail;