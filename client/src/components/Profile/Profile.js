import React, {useEffect, useRef, useState} from 'react';

import {Formik} from 'formik';
import AvatarEditor from 'react-avatar-editor';
import {Form, Card, Button, Tabs, Tab, Container, ListGroup} from 'react-bootstrap';
import * as Yup from 'yup';
import {disconnectSocial, editProfile, getLoginLink, getSocials} from '../../api/requests';
import {Link, useNavigate} from 'react-router-dom';
import {PASSWORD_CHANGE, PASSWORD_SET, SIGN_IN} from '../../constants/routes';
import {SOCIAL_LOGIN_URL} from '../../api/routes';


const BloggerUpdateSchema = Yup.object({
    username: Yup.string()
        .required('Required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Required'),
});

const MapProviderToName = {
    'github': 'GitHub',
    'google': 'Google',
};

export const Profile = ({user}) => {
    console.log(user);
    const [scale, setScale] = useState(50);
    const [img, setImg] = useState(null);
    const editor = useRef(null);
    const hiddenFileInput = useRef(null);
    const [socials, setSocials] = useState({google: null, github: null});
    const [githubLoginLink, setGithubLoginLink] = useState('');
    const [googleLoginLink, setGoogleLoginLink] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLink = async provider => {
            const response = await getLoginLink(provider);
            if (provider === 'github') {
                setGithubLoginLink(response.data.url);
            } else if (provider === 'google') {
                setGoogleLoginLink(response.data.url);
            }
        }

        const fetchSocials = async () => {
            const response = await getSocials();
            const new_data = {};
            response.data.forEach(social => {
                new_data[social.provider] = social;
            });
            setSocials({...socials, ...new_data});
        };

        fetchLink('github');
        fetchLink('google');

        fetchSocials();
    }, []);

    return (
        <Container>
            <Tabs
                defaultActiveKey="profile"
                className="mx-auto"
                style={{width: '30rem'}}
            >
                <Tab eventKey="profile" title="Profile" className="mx-auto" style={{width: '30rem'}}>
                    <Card>
                        <Card.Title>Edit profile</Card.Title>
                        <Card.Body>
                            <Formik
                                initialValues={{...user}}
                                validationSchema={BloggerUpdateSchema}
                                onSubmit={async values => {
                                    // TODO handle errors
                                    try {
                                        try {
                                            values.avatar = {file: editor.current.getImage().toDataURL()};
                                        } catch (error) {
                                            values.avatar = null;
                                        }
                                        await editProfile(values)
                                            .then(response => {
                                                console.log(response);
                                                if (response.status === 204) {
                                                    // TODO swal should fire: account edited
                                                }
                                            })
                                            .catch(error => {
                                                console.log('error in axios', error);
                                            })
                                    } catch (error) {
                                        console.log(error);
                                    }
                                }}
                            >
                                {formik => (
                                    <Form noValidate onSubmit={formik.handleSubmit}>
                                        <Form.Group className="mb-3" controlId="username">
                                            <Form.Label>Username</Form.Label>
                                            <Form.Control
                                                name="username"
                                                type="text"
                                                placeholder="Username"
                                                {...formik.getFieldProps('username')}
                                            />
                                            {formik.touched.username && formik.errors.username ? (
                                                <Form.Text className="text-muted">
                                                    {formik.errors.username}
                                                </Form.Text>
                                            ) : null}
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="email">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                name="email"
                                                type="text"
                                                placeholder="Email"
                                                {...formik.getFieldProps('email')}
                                            />
                                            {formik.touched.email && formik.errors.email ? (
                                                <Form.Text className="text-muted">
                                                    {formik.errors.email}
                                                </Form.Text>
                                            ) : null}
                                        </Form.Group>

                                        <Form.Group className="mb-3" controlId="avatar">
                                            <Form.Label>Avatar</Form.Label>
                                            <AvatarEditor
                                                ref={editor}
                                                width={250}
                                                height={250}
                                                image={img}
                                                color={[0, 0, 0, 0.8]}
                                                scale={scale / 50}
                                                onLoadSuccess={imgInfo => console.log(imgInfo)}
                                                id="avatar"
                                                name="avatar"
                                            />
                                            <input type="range" min="1" max="100" value={scale} id="myRange" step="1"
                                                   onInput={(event) => {
                                                       setScale(event.target.value);
                                                   }}/>
                                            <Button type="button" onClick={() => {
                                                hiddenFileInput.current.click();
                                            }}>Choose image</Button>
                                            <input
                                                type="file"
                                                onChange={(event) => {
                                                    setImg(event.target.files[0]);
                                                }}
                                                ref={hiddenFileInput}
                                                style={{display: 'none'}}
                                            />
                                        </Form.Group>

                                        <Button variant="primary" type="submit">
                                            Save
                                        </Button>
                                    </Form>
                                )}
                            </Formik>
                        </Card.Body>
                        <Card.Footer>
                            {user.has_usable_password ? (
                                <Link to={PASSWORD_CHANGE}>Change password</Link>
                            ) : (
                                <Link to={PASSWORD_SET}>Set password</Link>
                            )}
                        </Card.Footer>
                    </Card>
                </Tab>
                <Tab eventKey="socials" title="Socials" className="mx-auto" style={{width: '30rem'}}>
                    <ListGroup>
                        {Object.keys(socials).map((key, i) => {
                            const social = socials[key];
                            if (social) {
                                return <ListGroup.Item className="d-flex justify-content-between" key={i}>
                                    Connected to {MapProviderToName[social.provider]} as {social.login || social.name}
                                    <Button variant='outline-primary' size="sm" onClick={async () => {
                                        await disconnectSocial(social.id);
                                        localStorage.removeItem('token');
                                        navigate(SIGN_IN);
                                    }}>
                                        Disconnect
                                    </Button>
                                </ListGroup.Item>
                            } else {
                                return <ListGroup.Item className="d-flex justify-content-between" key={i}>
                                    Connect to {MapProviderToName[key]}
                                    {key === 'google' && (
                                        <a href={googleLoginLink} className="link-primary">
                                            Connect
                                        </a>
                                    )}
                                    {key === 'github' && (
                                        <a href={githubLoginLink} className="link-primary">
                                            Connect
                                        </a>
                                    )}
                                </ListGroup.Item>
                            }
                        })}
                    </ListGroup>
                </Tab>
            </Tabs>
        </Container>
    )
};