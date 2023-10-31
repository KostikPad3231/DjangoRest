import React, {useContext, useEffect, useRef, useState} from 'react';

import {Formik} from 'formik';
import AvatarEditor from 'react-avatar-editor';
import {Form, Card, Button, Tabs, Tab, Container, ListGroup} from 'react-bootstrap';
import * as Yup from 'yup';
import {disconnectSocial, editProfile, getLoginLink, getMe, getSocials} from '../../api/requests';
import {Link, useNavigate} from 'react-router-dom';
import {PASSWORD_CHANGE, PASSWORD_SET, PROFILE, SIGN_IN} from '../../constants/routes';
import {SOCIAL_LOGIN_URL} from '../../api/routes';
import {Header} from '../Header';
import {MessageContext} from '../MessageContext';
import {Footer} from '../Footer';


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

export const Profile = (props) => {
    const [user, setUser] = useState(props.user);
    const [reload, setReload] = useState(true);
    const [errors, setErrors] = useState({});
    const [scale, setScale] = useState(50);
    const [img, setImg] = useState(null);
    const editor = useRef(null);
    const hiddenFileInput = useRef(null);
    const [socials, setSocials] = useState({google: null, github: null});
    const [githubLoginLink, setGithubLoginLink] = useState('');
    const [googleLoginLink, setGoogleLoginLink] = useState('');
    const navigate = useNavigate();
    const {newMessage} = useContext(MessageContext);

    const fetchMe = async () => {
        try {
            const response = await getMe();
            if (response.status === 200) {
                setUser(response.data);
            }
        } catch (error) {
            console.error('Error getting user:', error);
        }
    }

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
        <>
            <Header user={user}/>
            <Container className="my-3">
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
                                        try {
                                            try {
                                                values.avatar = {file: editor.current.getImage().toDataURL()};
                                            } catch (error) {
                                                values.avatar = null;
                                            }
                                            const response = await editProfile(values)
                                            if (response.status === 200) {
                                                newMessage('Profile has been edited successfully');
                                                fetchMe();
                                            }
                                        } catch (error) {
                                            console.log(error);
                                            const errors = {};
                                            const errorData = error.response.data;
                                            for (const key in errorData) {
                                                const element = errorData[key];
                                                errors[key] = element.toString();
                                            }
                                            setErrors(errors);
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
                                                {(formik.touched.username && formik.errors.username) || errors.username ? (
                                                    <>
                                                        <Form.Text className="text-muted">
                                                            {formik.errors.username}
                                                        </Form.Text>
                                                        <Form.Text className="text-muted">
                                                            {errors.username}
                                                        </Form.Text>
                                                    </>
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
                                                {(formik.touched.email && formik.errors.email) || errors.email ? (
                                                    <>
                                                        <Form.Text className="text-muted">
                                                            {formik.errors.email}
                                                        </Form.Text>
                                                        <Form.Text className="text-muted">
                                                            {errors.email}
                                                        </Form.Text>
                                                    </>
                                                ) : null}
                                            </Form.Group>

                                            <Form.Group className="mb-3" controlId="avatar">
                                                <div>
                                                    <Form.Label>Avatar</Form.Label>
                                                </div>
                                                <div>
                                                    <AvatarEditor
                                                        ref={editor}
                                                        width={250}
                                                        height={250}
                                                        image={img}
                                                        color={[0, 0, 0, 0.8]}
                                                        scale={scale / 50}
                                                        id="avatar"
                                                        name="avatar"
                                                    />
                                                </div>
                                                <div>
                                                    <input id="scale" type="range" min="1" max="100" value={scale}
                                                           step="1"
                                                           style={{width: '300px'}}
                                                           onInput={(event) => {
                                                               setScale(event.target.value);
                                                           }}/>
                                                </div>
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
                                        Connected
                                        to {MapProviderToName[social.provider]} as {social.login || social.name}
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
            <Footer/>
        </>
    )
};