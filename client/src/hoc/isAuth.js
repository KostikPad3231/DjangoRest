import React, {useEffect, useState} from 'react';
import {getMe, verifyToken} from '../api/requests';
import {SIGN_IN} from '../constants/routes'
import {useNavigate} from "react-router-dom";

export const isAuth = (WrappedComponent, props) => {
    const Comp = (props) => {
        const navigate = useNavigate();
        const [isLoading, setIsLoading] = useState(true);
        const [isAuthenticated, setIsAuthenticated] = useState(false);
        const [user, setUser] = useState(null);
        // const [messages, setMessages] = useState([]);

        useEffect(() => {
            const fetchMe = async () => {
                try {
                    const response = await getMe();
                    if (response.status === 200) {
                        setUser(response.data);
                    }
                } catch (error) {
                    console.error('Error getting user:', error);
                }
            };
            const fetchData = async () => {
                try {
                    const response = await verifyToken();
                    if (response.status === 200 && response.data.verified) {
                        await fetchMe();
                        setIsAuthenticated(true);
                        setIsLoading(false);
                    } else {
                        navigate(SIGN_IN);
                    }
                } catch (error) {
                    localStorage.clear();
                    console.error('Error verifying token:', error);
                    setIsLoading(false);
                    navigate(SIGN_IN);
                }
            };
            // const fetchUser = async () => {
            //     const response = await getMe();
            //     await setUser(response.data);
            // };
            fetchData();
        }, []);

        if (isLoading) {
            return <div>Loading</div>;
        }

        if (isAuthenticated) {
            return (
                // <MessageContext.Provider value={messages}>
                    <WrappedComponent {...props} user={user}/>
                // </MessageContext.Provider>
            );
        }
    };
    return <Comp {...props}/>;
};