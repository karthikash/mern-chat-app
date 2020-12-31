import { Component, createRef } from "react";
import { Button, Card, CardBody, CardSubtitle, Col, Container, Form, FormFeedback, FormGroup, Input, ListGroup, ListGroupItem, Media, Row } from "reactstrap";
import { Constants } from '../../config';
import $ from 'jquery';
import moment from 'moment';
import { io } from 'socket.io-client';

const socket = io(Constants.REACT_APP_SOCKET);

class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = this.getInitialState();
        this.messagesEnd = createRef();
        this.socket = socket;
    }

    componentDidUpdate() {
        this.autoscroll();
        //this.messagesEnd.scrollIntoView({ behavior: "auto" });
    }

    autoscroll = () => {
        this.messagesEnd.scrollIntoView({ behavior: "auto" });
    }

    getInitialState = () => ({
        userList: [],
        errors: {},
        response: {
            status: '',
            message: '',
            error: ''
        },
        selectedUser: {
            activeIndex: null,
            userId: '',
            name: '',
            username: '',
            dp: '',
            lastseen: ''
        },
        chat: {
            message: '',
        },
        files: {
            media: ''
        },
        messages: []
    });

    handleChange = (e) => {
        if (e.target.files) {
            this.setState({
                files: {
                    media: e.target.files[0]
                }
            });
        } else {
            this.setState({
                chat: {
                    ...this.state.chat,
                    [e.target.name]: e.target.value,
                }
            });
        }
    }

    componentDidMount() {
        this.autoscroll();
        this.socket.on('socket.id', (socketid) => {
            localStorage.setItem('socketid', socketid);
        });

        this.socket.on('refresh_messages', receiverId => {
            console.log(receiverId);
            const _id = localStorage.getItem('_id');
            const { selectedUser } = this.state;
            if (_id === receiverId) {
                this.isActive(selectedUser.activeIndex, selectedUser);
                this.socket.emit('receiver', true);
            } else {
                this.socket.emit('receiver', false);
            }
        });

        const _id = localStorage.getItem('_id');
        const token = localStorage.getItem('token');
        const httpHeaders = {
            'Authorization': `Bearer ${token}`
        }
        const options = {
            method: 'GET',
            headers: new Headers(httpHeaders)
        }
        fetch(`${Constants.REACT_APP_API_BASE_URL}/user/list?_id=${_id}`, options)
            .then(async (success) => {
                const response = await success.json();
                this.setState({
                    'userList': response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    isActive = (index, user) => {
        if (user && user.userId) {
            this.setState({
                selectedUser: {
                    activeIndex: index,
                    userId: user.userId,
                    name: user.name,
                    username: user.username,
                    dp: user.dp,
                    lastseen: user.lastseen
                }
            });
        } else {
            this.setState({
                selectedUser: {
                    activeIndex: index,
                    userId: user._id,
                    name: `${user.sFirstName} ${user.sLastName}`,
                    username: user.sUsername,
                    dp: user.sImage,
                    lastseen: user.createdAt
                }
            });
        }
        const userId = localStorage.getItem('_id');
        const token = localStorage.getItem('token');
        const receiver = user._id || user.userId;
        const httpHeaders = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${token}`
        };
        const options = {
            method: 'GET',
            headers: new Headers(httpHeaders)
        };
        fetch(`${Constants.REACT_APP_API_BASE_URL}/chat/list?sender=${userId}&receiver=${receiver}`, options)
            .then(async (success) => {
                const json = await success.json();
                this.setState({
                    messages: json.data
                });
            })
            .catch((error) => {
                console.log('error: ', error);
            });
    }

    uploadButton = () => {
        $('input[type=file]').trigger('click');
    }

    sendMessage = (e) => {
        e.preventDefault();
        const { chat, selectedUser, files } = this.state;
        const userId = localStorage.getItem('_id');
        const token = localStorage.getItem('token');
        if (files && files.media) {
            const data = new FormData();
            data.append('oFrom', userId);
            data.append('oTo', selectedUser.userId);
            data.append('media', files.media);
            const httpHeaders = {
                'Authorization': `Bearer ${token}`
            }
            const options = {
                method: 'POST',
                headers: new Headers(httpHeaders),
                body: data
            };
            fetch(`${Constants.REACT_APP_API_BASE_URL}/chat/upload`, options)
                .then((success) => {
                    this.setState({
                        selectedUser: {
                            activeIndex: selectedUser.activeIndex,
                            userId: selectedUser.userId,
                            name: selectedUser.name,
                            username: selectedUser.username,
                            dp: selectedUser.dp,
                            lastseen: selectedUser.lastseen
                        },
                        files: {
                            media: ''
                        }
                    });
                    this.isActive(selectedUser.activeIndex, selectedUser);
                    this.socket.emit('new_text_message', {
                        sMessage: chat.message,
                        oFrom: userId,
                        oTo: selectedUser.userId
                    });
                })
                .catch((error) => {
                    console.log('error: ', error);
                });
        } else {
            const httpHeaders = {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
            const options = {
                method: 'POST',
                headers: new Headers(httpHeaders),
                body: JSON.stringify({
                    sMessage: chat.message,
                    oFrom: userId,
                    oTo: selectedUser.userId
                })
            };
            fetch(`${Constants.REACT_APP_API_BASE_URL}/chat/send`, options)
                .then(async (success) => {
                    this.setState({
                        chat: {
                            message: ''
                        }
                    });
                    this.isActive(selectedUser.activeIndex, selectedUser);
                    this.socket.emit('new_text_message', {
                        sMessage: chat.message,
                        oFrom: userId,
                        oTo: selectedUser.userId
                    });
                })
                .catch((error) => {
                    console.log('error: ', error);
                });
        }
    }

    isMessageTyped = () => {
        const { message } = this.state.chat;
        const { media } = this.state.files;
        if (message && message.length > 0) {
            return true;
        } else if (typeof media === "object") {
            return true;
        } else {
            return false;
        }
    }

    render() {
        const { activeIndex, name, dp, lastseen } = this.state.selectedUser;
        const { chat, messages, userList } = this.state;
        const users = (userList && userList.length > 0 ?
            userList.map((user, index) => {
                const className = activeIndex === index ? 'active' : '';
                return <ListGroupItem className={className} key={user._id} onClick={this.isActive.bind(this, index, user)}>
                    <Row>
                        <Col md="3">
                            <span className="pull-left">
                                <Media className="dp" src={user.sImage} />
                            </span>
                        </Col>
                        <Col md="9">
                            {`${user.sFirstName} ${user.sLastName}`}<br />
                            <em style={{ color: "black" }}>{`@${user.sUsername}`}</em>
                        </Col>
                    </Row>
                </ListGroupItem>
            })
            :
            null
        );
        return (
            <div>
                <Row>
                    <Col md="4">
                        <Card className="chat-card">
                            <CardBody>
                                <CardSubtitle tag="h5" className="mb-2 text-muted">Users</CardSubtitle>
                                <br />
                                <ListGroup className="scroll">{users ? users : null}</ListGroup>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="8">
                        <Card className="chat-card">
                            <CardBody>
                                <CardSubtitle className="text-muted">
                                    <Row>
                                        <Col md="1">
                                            <span className="pull-left">
                                                <Media className="dp" src={dp} />
                                            </span>
                                        </Col>
                                        <Col md="11" className="pull-left">
                                            <Container>
                                                <Row>
                                                    {name}
                                                </Row>
                                                <Row>
                                                    {lastseen ?
                                                        <small><em> {'last seen ' + moment(lastseen).fromNow()}</em></small>
                                                        : <span className="m-auto" style={{ fontSize: "20px" }}>Click on user to start chat</span>}
                                                </Row>
                                            </Container>
                                        </Col>
                                    </Row>
                                </CardSubtitle>
                                <hr />
                                <ListGroup className="scroll" style={{ paddingBottom: "60px" }}>
                                    {messages && messages.length > 0 ?
                                        messages.map((message, index) => {
                                            const _id = localStorage.getItem('_id');
                                            return (_id === message.oFrom._id ?
                                                <ListGroupItem key={index} style={{ border: "none" }}>
                                                    <Row>
                                                        <Col md="6"></Col>
                                                        <Col md="6" style={{ textAlign: "end" }}>
                                                            {message.sMessage.includes('http://') ?
                                                                (message.sMessage.includes('.mp4') ?
                                                                    <video src={message.sMessage} height="100%" width="100%" style={{ padding: "8px" }} controls autoPlay muted></video>
                                                                    :
                                                                    <img src={message.sMessage} height="100%" width="100%" alt="" style={{ borderRadius: "10px", padding: "8px" }}></img>
                                                                )
                                                                :
                                                                <span style={{ backgroundColor: "#f7f7f7", borderColor: "#292b2c", borderRadius: "40px", padding: "8px" }}>
                                                                    {message.sMessage}
                                                                </span>
                                                            }
                                                        </Col>
                                                    </Row>
                                                </ListGroupItem> :
                                                <ListGroupItem key={index} style={{ border: "none" }}>
                                                    <Row>
                                                        <Col md="6" style={{ textAlign: "start" }}>
                                                            {message.sMessage.includes('http://') ?
                                                                (message.sMessage.includes('.mp4') ?
                                                                    <video src={message.sMessage} height="100%" width="100%" style={{ padding: "8px" }} controls autoPlay muted></video>
                                                                    :
                                                                    <img src={message.sMessage} height="100%" width="100%" alt="" style={{ borderRadius: "10px", padding: "8px" }}></img>
                                                                )
                                                                :
                                                                <span style={{ backgroundColor: "#f7f7f7", borderColor: "#292b2c", borderRadius: "40px", padding: "8px" }}>
                                                                    {message.sMessage}
                                                                </span>
                                                            }
                                                        </Col>
                                                        <Col md="6"></Col>
                                                    </Row>
                                                </ListGroupItem>
                                            )
                                        }) :
                                        null
                                    }
                                    <div ref={el => { this.messagesEnd = el; }} style={{ float: "left", clear: "both" }} > </div>
                                </ListGroup>
                                {activeIndex === 0 || activeIndex >= 1 ?
                                    <Form className="chat-form" onSubmit={this.sendMessage}>
                                        <Row>
                                            <Col md="1">
                                                <FormGroup>
                                                    <Button onClick={this.uploadButton}>
                                                        <i className="fa fa-camera" aria-hidden="true"></i>
                                                    </Button>
                                                    <Input type="file" id="media" name="media" accept="image/*, video/*" style={{ display: "none" }} onChange={this.handleChange} />
                                                </FormGroup>
                                            </Col>
                                            <Col md="10">
                                                <FormGroup style={{ paddingLeft: "25px" }}>
                                                    <Input type="text" id="message" name="message" onChange={this.handleChange} value={chat.message} autoComplete="off" />
                                                    <FormFeedback></FormFeedback>
                                                </FormGroup>
                                            </Col>
                                            <Col md="1">
                                                <FormGroup>
                                                    <Button color="primary" disabled={!this.isMessageTyped()}>
                                                        <i className="fa fa-paper-plane" aria-hidden="true" ></i>
                                                    </Button>
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                    </Form>
                                    : null
                                }
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };
}

export default Chat;