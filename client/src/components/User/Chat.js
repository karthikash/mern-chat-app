import { Component, createRef } from "react";
import { Button, Card, CardBody, CardSubtitle, Col, Form, FormFeedback, FormGroup, Input, ListGroup, ListGroupItem, Media, Row } from "reactstrap";
import { Constants } from '../../config';
import $ from 'jquery';
import moment from 'moment';
import { io } from 'socket.io-client';
import * as imageConversion from 'image-conversion';

class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = this.getInitialState();
        this.messagesEnd = createRef();
        this.socket = io.connect('http://localhost:3001', {
            origin: '*',
            path: '/socket.io',
            transports: ['websocket']
        });
    }

    componentDidUpdate() {
        this.autoscroll();
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
        messages: [],
        online_users: [],
        typing: {
            sender: '',
            receiver: '',
            status: ''
        },
        back: false,
        matches: window.matchMedia("(min-width: 992px)").matches
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

        const handler = e => this.setState({ matches: e.matches });
        window.matchMedia("(min-width: 992px)").addEventListener('change', handler);

        const _id = localStorage.getItem('_id');

        this.socket.on('socket.id', (socketid) => {
            this.socket.emit('join', { _id, socketid, room: 'chat-app' });
            localStorage.setItem('socketid', socketid);
        });

        this.socket.on('users_online', (data) => {
            this.setState({ online_users: data });
        });

        this.socket.on('refresh_messages', receiverId => {
            const _id = localStorage.getItem('_id');
            const { selectedUser } = this.state;
            if (_id === receiverId) {
                this.isActive(selectedUser.activeIndex, selectedUser);
                this.socket.emit('receiver', true);
            } else {
                this.socket.emit('receiver', false);
            }
        });

        this.socket.on('iamtyping', ({ sender, receiver, status }) => {
            this.setState({
                typing: {
                    sender: sender,
                    receiver: receiver,
                    status: status
                }
            });
        });

        this.socket.on('user_left', _id => {
            localStorage.removeItem('socketid');
            const { activeIndex, userId, name, username, dp } = this.state.selectedUser;
            this.setState({
                selectedUser: {
                    activeIndex: activeIndex,
                    userId: userId,
                    name: name,
                    username: username,
                    dp: dp,
                    lastseen: moment()
                }
            })
        });

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
                console.error(error);
            });
    }

    isUserTyping = (e) => {
        let timeout;
        const _id = localStorage.getItem('_id');
        const { userId } = this.state.selectedUser;
        if (e.which !== 13) {
            this.socket.emit('typing', { sender: _id, receiver: userId, status: true });
            clearTimeout(timeout);
            timeout = setTimeout(this.typingTimeout, 1500)
        } else {
            clearTimeout(timeout);
            this.typingTimeout();
        }
    }

    typingTimeout = () => {
        const _id = localStorage.getItem('_id');
        const { userId } = this.state.selectedUser;
        this.socket.emit('typing', { sender: _id, receiver: userId, status: false });
    }

    isActive = async (index, user) => {
        $('.chat-box').show();
        if (user && user.userId) {
            this.setState({
                selectedUser: {
                    activeIndex: index,
                    userId: user.userId,
                    name: user.name,
                    username: user.username,
                    dp: user.dp,
                    lastseen: user.lastseen
                },
                back: false
            });
        } else {
            this.setState({
                selectedUser: {
                    activeIndex: index,
                    userId: user._id,
                    name: `${user.sFirstName} ${user.sLastName}`,
                    username: user.sUsername,
                    dp: user.sImage,
                    lastseen: user.updatedAt
                },
                back: false
            });
        }
        const userId = localStorage.getItem('_id');
        const receiver = user._id || user.userId;
        this.socket.emit('req_messages', { sender: userId, receiver });
        this.socket.on('messages', (data) => {
            this.setState({ messages: data });
        });
    }

    uploadButton = () => {
        $('input[type=file]').trigger('click');
    }

    getBase64 = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = function () {
            resolve(reader.result);
        };
        reader.readAsDataURL(file);
    });

    sendMessage = async (e) => {
        e.preventDefault();
        const { chat, selectedUser, files } = this.state;
        const userId = localStorage.getItem('_id');
        if (files && files.media) {
            const file = await imageConversion.compress(files.media, 0.8);
            const base64 = await this.getBase64(file);
            this.setState({ chat: { message: '' } });
            this.isActive(selectedUser.activeIndex, selectedUser);
            this.socket.emit('new_media_message', {
                oFrom: userId,
                oTo: selectedUser.userId,
                fileName: files.media.name,
                file: base64
            });
        } else {
            this.setState({ chat: { message: '' } });
            this.isActive(selectedUser.activeIndex, selectedUser);
            this.socket.emit('new_text_message', { sMessage: chat.message, oFrom: userId, oTo: selectedUser.userId });
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

    handleBackButton = () => {
        this.setState({
            back: true,
            selectedUser: {
                activeIndex: null,
                userId: '',
                name: '',
                username: '',
                dp: '',
                lastseen: ''
            }
        });
        $('.chat-box').hide();
    }

    render() {
        const { activeIndex, userId, name, dp, lastseen } = this.state.selectedUser;
        const { chat, messages, userList, online_users, matches, back, selectedUser } = this.state;
        const { sender, receiver, status } = this.state.typing;
        const local_id = localStorage.getItem('_id');
        const users = (userList && userList.length > 0 ?
            userList.map((user, index) => {
                const className = activeIndex === index ? 'active' : '';
                let isUserOnline = online_users.find((e) => e._id === user._id ? true : false);
                return (isUserOnline ?
                    <ListGroupItem className={className} key={user._id} onClick={this.isActive.bind(this, index, user)}>
                        <Row>
                            <Col md="3" sm="3" xs="3">
                                <span className="pull-left">
                                    <Media className="dp" src={user.sImage} />
                                </span>
                            </Col>
                            <Col md="9" sm="9" xs="9">
                                {`${user.sFirstName} ${user.sLastName}`}&nbsp;&nbsp;
                                <span style={{ height: "10px", width: "10px", backgroundColor: '#00FF00', borderRadius: "50%", display: "inline-block" }}></span><br />
                                <em style={className === 'active' ? { color: "white" } : { color: "black" }}>{`@${user.sUsername}`}</em>
                            </Col>
                        </Row>
                    </ListGroupItem> :
                    <ListGroupItem className={className} key={user._id} onClick={this.isActive.bind(this, index, user)}>
                        <Row>
                            <Col md="3" sm="3" xs="3">
                                <span className="pull-left">
                                    <Media className="dp" src={user.sImage} />
                                </span>
                            </Col>
                            <Col md="9" sm="9" xs="9">
                                {`${user.sFirstName} ${user.sLastName}`}<br />
                                <em style={className === 'active' ? { color: "white" } : { color: "black" }}>{`@${user.sUsername}`}</em>
                            </Col>
                        </Row>
                    </ListGroupItem>
                )
            })
            :
            null
        );
        return (
            <div>
                <Row>
                    {matches &&
                        <Col md="4">
                            <Card className="chat-card">
                                <CardBody>
                                    <CardSubtitle tag="h6" className="mb-2 text-muted">Users</CardSubtitle>
                                    <br />
                                    <ListGroup className="scroll">{users ? users : null}</ListGroup>
                                </CardBody>
                            </Card>
                        </Col>
                    }
                    {!matches && back &&
                        <Col md="4">
                            <Card className="chat-card">
                                <CardBody>
                                    <CardSubtitle tag="h6" className="mb-2 text-muted">Users</CardSubtitle>
                                    <br />
                                    <ListGroup className="scroll">{users ? users : null}</ListGroup>
                                </CardBody>
                            </Card>
                        </Col>
                    }
                    <Col className="chat-box" md="8" sm="12" xs="12">
                        <Card className="chat-card">
                            <CardBody>
                                <CardSubtitle className="text-muted">
                                    <Row>
                                        {!matches &&
                                            <Col sm="3" xs="3" className="pull-left">
                                                <FormGroup>
                                                    <Button style={{ color: '#147EFB', backgroundColor: 'white', border: 'none' }} onClick={this.handleBackButton}>
                                                        <i className="fa fa-chevron-left" aria-hidden="true" ></i>
                                                    </Button>
                                                </FormGroup>
                                            </Col>
                                        }
                                        <Col md="2" sm="2" xs="2">
                                            <span className="pull-right">
                                                <Media className="dp" src={dp} />
                                            </span>
                                        </Col>
                                        <Col md="10" sm="7" xs="7" className="pull-left">
                                            <Row>
                                                {name}
                                            </Row>
                                            <Row>
                                                {activeIndex ?
                                                    (online_users.find(e => e._id === userId ? true : false) ?
                                                        (sender === userId && receiver === local_id && status === true ?
                                                            <small><em>typing...</em></small>
                                                            :
                                                            <small><em>Online</em></small>
                                                        ) :
                                                        <small><em>{'last seen ' + moment(lastseen).fromNow()}</em></small>
                                                    ) :
                                                    (activeIndex ?
                                                        (activeIndex >= 0 ?
                                                            <small><em>{'last seen ' + moment(lastseen).fromNow()}</em></small>
                                                            :
                                                            <span className="m-auto" style={{ fontSize: "20px" }}>{selectedUser.name}</span>
                                                        ) :
                                                        (activeIndex === 0 ?
                                                            (online_users.find(e => e._id === userId ? true : false) ?
                                                                (sender === userId && receiver === local_id && status === true ?
                                                                    <small><em>typing...</em></small>
                                                                    :
                                                                    <small><em>Online</em></small>
                                                                ) :
                                                                <small><em>{'last seen ' + moment(lastseen).fromNow()}</em></small>
                                                            ) :
                                                            null
                                                        )
                                                    )
                                                }
                                                {!activeIndex && <div></div>}
                                            </Row>
                                        </Col>
                                    </Row>
                                </CardSubtitle>
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
                                                                <span style={{ color: '#FFFFFF', backgroundColor: "#147EFB", borderColor: "#292B2C", borderRadius: "40px", padding: "8px" }}>
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
                                                                <span style={{ backgroundColor: "#F7F7F7", borderColor: "#292B2C", borderRadius: "40px", padding: "8px" }}>
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
                                    <Form className="chat-form" style={{ borderTop: 'solid', borderColor: '#BDBDBD', borderWidth: '0.5px' }} onSubmit={this.sendMessage}>
                                        <Row>
                                            <Col md="1" sm="2" xs="2">
                                                <FormGroup>
                                                    <Button style={{ backgroundColor: '#BDBDBD', border: 'none', borderRadius: "50px" }} onClick={this.uploadButton}>
                                                        <i className="fa fa-camera" aria-hidden="true"></i>
                                                    </Button>
                                                    <Input type="file" id="media" name="media" accept="image/*, video/*" style={{ display: "none" }} onChange={this.handleChange} />
                                                </FormGroup>
                                            </Col>
                                            <Col md="10" sm="8" xs="8">
                                                <FormGroup style={{ paddingLeft: "10px" }}>
                                                    <Input onKeyPress={this.isUserTyping} type="text" id="message" name="message" onChange={this.handleChange} value={chat.message} autoComplete="off" />
                                                    <FormFeedback></FormFeedback>
                                                </FormGroup>
                                            </Col>
                                            <Col md="1" sm="2" xs="2">
                                                <FormGroup>
                                                    <Button style={{ backgroundColor: '#147EFB', border: 'none', borderRadius: "50px" }} disabled={!this.isMessageTyped()}>
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