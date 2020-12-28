import { Component } from "react";
import { Button, Card, CardBody, CardSubtitle, Col, Container, Form, FormGroup, Input, ListGroup, ListGroupItem, Media, Row } from "reactstrap";
import { Constants } from '../../config';
import $ from 'jquery';
import moment from 'moment';

class Chat extends Component {

    constructor(props) {
        super(props);

        this.state = this.getInitialState();
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
            activeIndex: '',
            userId: '',
            name: '',
            username: '',
            dp: '',
            lastseen: ''
        }
    });

    componentDidMount() {
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

    uploadButton = () => {
        $('input[type=file]').trigger('click');
    }

    render() {
        const { activeIndex, name, dp, lastseen } = this.state.selectedUser;
        const users = this.state.userList.map((user, index) => {
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
                        <span className="mb-2 text-muted">{`@${user.sUsername}`}</span>
                    </Col>
                </Row>
            </ListGroupItem>
        });
        return (
            <div>
                <Row>
                    <Col md="4">
                        <Card className="chat-card">
                            <CardBody>
                                <CardSubtitle tag="h5" className="mb-2 text-muted">Users</CardSubtitle>
                                <br />
                                <ListGroup className="scroll">{users}</ListGroup>
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
                                                    <small><em>{lastseen ? 'last seen ' + moment(lastseen).fromNow() : null}</em></small>
                                                </Row>
                                            </Container>
                                        </Col>
                                    </Row>
                                </CardSubtitle>
                                <hr />
                                <Form className="chat-form">
                                    <Row>
                                        <Col md="10">
                                            <FormGroup>
                                                <Input type="text" id="message" name="message" />
                                            </FormGroup>
                                        </Col>
                                        <Col md="1">
                                            <FormGroup>
                                                <Button onClick={this.uploadButton}>
                                                    <i className="fa fa-camera" aria-hidden="true"></i>
                                                </Button>
                                                <Input type="file" id="media" name="media" accept="image/*, video/*" style={{ display: "none" }} />
                                            </FormGroup>
                                        </Col>
                                        <Col md="1">
                                            <FormGroup>
                                                <Button color="primary">
                                                    <i className="fa fa-paper-plane" aria-hidden="true"></i>
                                                </Button>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };
}

export default Chat;