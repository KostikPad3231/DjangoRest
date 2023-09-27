import React from 'react';
import {MDBCardTitle} from 'mdb-react-ui-kit';

const loader = ({styles}) => (
    <MDBCardTitle style={styles}>
        <div className="loader" style={{margin: 'auto'}}></div>
    </MDBCardTitle>
);

export default loader;