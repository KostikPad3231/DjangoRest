import React, {Fragment} from 'react';
import ReactTable from 'react-table-v6';

import {RemoveCircleOutline} from 'react-ionicons';
import {CreateOutline} from 'react-ionicons';
import Pagination from './PaginateTable';

class BoardTable extends React.Component {
    render() {
        const columns = [
            {
                Header: 'General',
                columns: [
                    {
                        Header: 'Title',
                        accessor: 'name'
                    },
                    {
                        Header: 'Description',
                        accessor: 'description'
                    }
                ]
            },
            {
                Header: 'Actions',
                Cell: row => (
                    <div>
                        <CreateOutline
                            onClick={() => this.props.modal('modalEdit', row.original)}
                            fontSize="30px"
                            color="#007bff"
                        />
                        <RemoveCircleOutline
                            onClick={() => this.props.modal('modalDelete', row.original)}
                            fontSize="30px"
                            color="#007bff"
                        />
                    </div>
                )
            }
        ];
        return (
            <Fragment>
                <ReactTable
                    data={this.props.boards}
                    columns={columns}
                    showPagination={false}
                    showPageJump={false}
                    defaultPageSize={10}
                    className="-striped -highlight table"
                >
                    <Pagination
                        fetchData={this.props.fetchData}
                        page={this.props.page}
                        pages={this.props.pages}
                    />
                </ReactTable>
            </Fragment>
        );
    }
}

export default BoardTable;