import React, {Fragment} from 'react';

import {isAuth} from '../../hoc/isAuth';
import GetUsers from '../../components/Statistics/GetUsers';
import GetBoards from '../../components/Statistics/GetBoards';

const Main = () => (
    <Fragment>
        <GetUsers/>
        <GetBoards/>
    </Fragment>
);

export default isAuth(Main);