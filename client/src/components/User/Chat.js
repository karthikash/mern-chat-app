import { Component } from "react";
import { Button, Card, CardBody, CardSubtitle, Col, Form, FormGroup, Input, ListGroup, ListGroupItem, Media, Row } from "reactstrap";
import { Constants } from '../../config';

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

    handleClick = (e) => {
        e.preventDefault();
        console.log(e);
    }

    render() {
        const users = this.state.userList.map((user) => {
            return <ListGroupItem key={user._id} onClick={this.handleClick}>
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
                                <CardSubtitle tag="h5" className="mb-2 text-muted">Username</CardSubtitle>
                                <Form>
                                    <Row>
                                        <Col md="10">
                                            <FormGroup>
                                                <Input type="text" id="message" name="message" />
                                            </FormGroup>
                                        </Col>
                                        <Col md="2">
                                            <FormGroup>
                                                <Button color="primary" block>Send</Button>
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