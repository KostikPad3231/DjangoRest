import React, {Component, createRef} from 'react';
import {
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBCollapse,
    MDBNavbarNav,
    MDBIcon
} from 'mdb-react-ui-kit';
import Popover from 'react-simple-popover';

import {PROFILE, BOARDS} from '../../constants/routes';

import {logout} from '../../api/queries/index';

export default class NavBar extends Component {
    constructor(props) {
        super(props);
        this.targetRef = createRef();
    }
    state = {
        open: false,
        collapseID: ''
    };

    handleClick = () => {
        this.setState({open: !this.state.open});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    toggleCollapse = collapseID => () => {
        this.setState(state => {
            if (state.collapseID !== collapseID) {
                return {collapseID: collapseID};
            }
            return {collapseID: ''};
        });
    };

    handleLogout = () => {
        logout()
            .then(response => {
                localStorage.removeItem('token');
                window.location.href = '/login';
            })
            .catch(error => {
                console.log(error);
            });
    };

    render() {
        return (
            <MDBNavbar className="flexible-navbar" light expand="md" scrolling>
                <MDBNavbarBrand href="/">Landing</MDBNavbarBrand>
                <MDBNavbarToggler onClick={this.toggleCollapse('navbarCollapse13')}/>
                <MDBCollapse
                    id="navbarCollapse13"
                    show={this.state.open}
                    navbar
                >
                    <MDBNavbarNav left>
                        <MDBNavbarItem>
                            <MDBNavbarLink to={PROFILE}>Profile</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <MDBNavbarLink to={BOARDS}>Boards</MDBNavbarLink>
                        </MDBNavbarItem>
                    </MDBNavbarNav>
                </MDBCollapse>
                <MDBCollapse navbar>
                    <MDBNavbarNav right>
                        <MDBNavbarItem>
                            <a
                                className="nav-link navbar-link"
                                rel="noopener noreferrer"
                                target="_blank"
                                href="https://pl-pl.facebook.com/mdbootstrap/"
                            >
                                <MDBIcon icon="facebook"/>
                            </a>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <a
                                className="nav-link navbar-link"
                                rel="noopener noreferrer"
                                target="_blank"
                                href="https://twitter.com/mdbootstrap"
                            >
                                <MDBIcon icon="twitter"/>
                            </a>
                        </MDBNavbarItem>

                        <MDBNavbarItem>
                            <div
                                style={{display: "flex", cursor: "pointer"}}
                                className="nav-link navbar-link"
                                rel="noopener noreferrer"
                            >
                                <div className="button" ref={this.targetRef} onClick={this.handleClick}>
                                    <MDBIcon icon="user" className="mr-2"/>
                                </div>
                                <Popover
                                    placement="bottom"
                                    container={this}
                                    target={this.targetRef.current}
                                    show={this.state.open}
                                    onHide={this.handleClose}
                                >
                                    <div className="popover-items">
                                        <MDBNavbarLink to={BOARDS}>Boards</MDBNavbarLink>
                                        <MDBNavbarLink to={PROFILE} onClick={this.handleLogout}>
                                            Log out
                                        </MDBNavbarLink>
                                    </div>
                                </Popover>
                            </div>
                        </MDBNavbarItem>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
        );
    }
}