import React from 'react';
import profileImg from '../../assets/profile-icon-png-898.png';

const UserInfo = ({profile, avatar}) => {
    return (
        <div className="col-lg-2 col-xlg-2 col-md-3">
            <div className="card">
                <div className="card-body">
                    <center className="m-t-30">
                        {avatar && avatar.length > 0 ? (
                            <img
                                src={avatar}
                                alt="avatar"
                                className="card-img-top"
                                id="avatar"
                            />
                        ) : profile && profile.avatar ? (
                            <img
                                src={profile.avatar}
                                alt="avatar"
                                className="card-img-top"
                                id="avatar"
                            />
                        ) : (
                            <img src={profileImg} alt="avatar" className="card-img-top"/>
                        )}
                    </center>
                    <br/>
                    <h4 className="card-title text-center m-t-10">
                        {profile ? profile.username : null}
                    </h4>
                </div>
                <div>
                    <hr/>
                </div>
                <div className="card-body">
                    <small className="text-muted">Email address</small>
                    <h6>{profile ? profile.email : null}</h6>
                </div>
            </div>
        </div>
    );
};

export default UserInfo;