import React from 'react';
import {AddCircleOutline} from 'react-ionicons';

import './style.css';

const TableHeader = ({title, modalCreate}) => (
    <div className="table-header">
        <h4>{title}</h4>
        <AddCircleOutline
            onCLick={modalCreate}
            fontSize="30px"
            color="#007bff"
        />
    </div>
);

export default TableHeader;