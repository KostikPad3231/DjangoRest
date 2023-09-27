import React from 'react';
import {MDBListGroup, MDBListGroupItem, MDBIcon} from "mdb-react-ui-kit";
import {NavLink} from "react-router-dom";
import {PROFILE, BOARDS, DASHBOARD} from "../../constants/routes";


const Sidebar = () => (
    <div className="sidebar-fixed position-fixed">
        <MDBListGroup className="list-group-flush">
            <NavLink to={DASHBOARD} className={({ isActive }) => (isActive ? "activeClass" : "normalClass")}>
                <MDBListGroupItem>
                    <MDBIcon icon="pie-chart" className="mr-3"/>
                    Dashboard
                </MDBListGroupItem>
            </NavLink>
            <NavLink to={PROFILE} className={({ isActive }) => (isActive ? "activeClass" : "normalClass")}>
                <MDBListGroupItem>
                    <MDBIcon icon="user" className="mr-3"/>
                    Profile
                </MDBListGroupItem>
            </NavLink>
            <NavLink to={BOARDS} className={({ isActive }) => (isActive ? "activeClass" : "normalClass")}>
                <MDBListGroupItem>
                    <MDBIcon icon="table" className="mr-3"/>
                    Tasks
                </MDBListGroupItem>
            </NavLink>
        </MDBListGroup>
    </div>
);

export default Sidebar;