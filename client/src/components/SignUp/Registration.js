import React from 'react';
import {Link} from 'react-router-dom';

import * as path from '../../constants/routes';

export const Registration = () => {
    return (
        <>
            <Link to={path.SIGN_UP_READER}>I'm reader</Link>
            <Link to={path.SIGN_UP_BLOGGER}>I'm blogger</Link>
            Already have an account?<Link to={path.SIGN_IN}>Log in</Link>
        </>
    )
};