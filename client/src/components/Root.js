import React, {useState} from 'react';
import {Outlet} from 'react-router-dom';
import {MessageContext} from './MessageContext';
import {Messages} from './Messages';

export const Root = (props) => {
    const [messages, setMessages] = useState([]);
    const newMessage = (text, variant = 'success') => {
        const message = {
            id: Date.now(),
            variant: variant,
            text: text,
        };

        setMessages([...messages, message]);

        setTimeout(() => {
            setMessages(messages => messages.filter(m => m.id !== message.id));
        }, 5000);
    };
    return (
        <MessageContext.Provider value={{newMessage}}>
            <Outlet/>
            <Messages messages={messages}/>
        </MessageContext.Provider>
    );
};