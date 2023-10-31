import React, {useEffect, useState} from 'react';
import {Link} from 'react-router-dom';

import * as path from '../../constants/routes';
import {Header} from '../Header';
import {Footer} from '../Footer';
import {Button, Card, Container} from 'react-bootstrap';
import {getCategories} from '../../api/requests';

export const Registration = () => {
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const result = await getCategories();
                setCategories(result.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchCategories();
    }, []);
    return (
        <>
            <Header/>
            <Container className="mx-auto my-3" style={{width: "20rem"}}>
                <Card>
                    <Card.Body className="d-flex justify-content-around">
                        <Link to={path.SIGN_UP_READER} state={{categories}}><Button variant="warning">I'm reader</Button></Link>
                        <Link to={path.SIGN_UP_BLOGGER} state={{categories}}><Button variant="warning">I'm blogger</Button></Link>
                    </Card.Body>
                    <Card.Footer>
                        Already have an account? <Link to={path.SIGN_IN}>Log in</Link>
                    </Card.Footer>
                </Card>
            </Container>
            <Footer/>
        </>
    )
};