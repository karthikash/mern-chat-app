import { Component } from "react";
import { Button, Card, CardBody, CardImg, CardSubtitle, CardTitle, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import { isAlpha } from "validator";
import { Constants } from '../../config';
import moment from "moment";
import $ from 'jquery';

class Profile extends Component {

    constructor(props) {
        super(props);

        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        user: {
            _id: '',
            eGender: '',
            sFirstName: '',
            sImage: '',
            sLastName: '',
            sUsername: '',
            createdAt: '',
            updatedAt: '',
        },
        files: {
            dp: ''
        },
        errors: {},
        response: {
            status: '',
            message: '',
            error: ''
        }
    });

    handleChange = (e) => {
        this.setState({
            user: {
                ...this.state.user,
                [e.target.name]: e.target.value
            },
            errors: {
                ...this.state.errors,
                [e.target.name]: ''
            },
            files: {
                dp: e.target.files[0]
            }
        });
        //if (e.target.files[0]) {
        //} else {
        //$('.select').attr('disabled', true); 
        //}/
    }

    validate = () => {
        const { user } = this.state;
        let errors = {};
        if (!isAlpha(user.sFirstName)) errors.sFirstName = 'First name must only contain alphabets.';
        if (user.sFirstName === '') errors.sFirstName = 'First name cannot be empty.';
        if (!isAlpha(user.sLastName)) errors.sLastName = 'Last name must only contain alphabets.';
        if (user.sLastName === '') errors.sLastName = 'Last name cannot be empty.';
        if (user.sUsername === '') errors.sUsername = 'Username cannot be empty.';
        return errors;
    }

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
        fetch(`${Constants.REACT_APP_API_BASE_URL}/user/get?_id=${_id}`, options)
            .then(async (success) => {
                const response = await success.json();
                localStorage.setItem('dp', response.data.sImage);
                this.setState({
                    'user': response.data
                });
            })
            .catch(error => {
                console.log(error);
            });
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { user } = this.state;
        const errors = this.validate();
        if (Object.keys(errors).length === 0) {
            const token = localStorage.getItem('token');
            const httpHeaders = {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
            const options = {
                method: 'PATCH',
                headers: new Headers(httpHeaders),
                body: JSON.stringify({
                    sFirstName: user.sFirstName,
                    sLastName: user.sLastName,
                    sUsername: user.sUsername
                })
            };
            fetch(`${Constants.REACT_APP_API_BASE_URL}/user/update/${user._id}`, options)
                .then(async (success) => {
                    const response = await success.json();
                    this.setState({ user, response });
                })
                .catch((error) => {
                    console.log('error: ', error);
                });
            this.setState(this.getInitialState());
        } else {
            this.setState({ errors });
        }
    }

    uploadProfilePic = () => {
        const { files } = this.state;
        const _id = localStorage.getItem('_id');
        const token = localStorage.getItem('token');
        const data = new FormData();
        data.append('_id', _id);
        data.append('dp', files.dp);
        const httpHeaders = {
            'Authorization': `Bearer ${token}`
        }
        const options = {
            method: 'PATCH',
            headers: new Headers(httpHeaders),
            body: data
        };
        fetch(`${Constants.REACT_APP_API_BASE_URL}/user/upload/dp`, options)
            .then((success) => {
                return window.location.reload();
            })
            .catch((error) => {
                console.log('error: ', error);
            });
        this.setState(this.getInitialState());
    }

    uploadButton = () => {
        $('input[type=file]').trigger('click');
    }

    isFileSelected = () => {
        const { dp } = this.state.files;
        console.log(dp);
        if (dp) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        const { user, errors, response } = this.state;
        return (
            <div>
                <Row>
                    <Col md="4">
                        <Card className="edit-profile-card" style={{ borderColor: "white" }}>
                            <CardImg top width="100%" src={user.sImage} alt="Change your avatar" style={{ borderRadius: "50%" }} />
                            <br />
                            <Row className="justify-content-center">
                                <Col md="5">
                                    <Button color="secondary" onClick={this.uploadButton} block>Choose</Button>
                                    <Input type="file" accept="image/*" multiple={false} style={{ display: "none" }} onChange={this.handleChange} />
                                </Col>
                                <Col md="5">
                                    <Button color="secondary" onClick={this.uploadProfilePic} block disabled={!this.isFileSelected()}>Upload</Button>
                                </Col>
                            </Row>
                            <CardBody>
                                <CardTitle tag="h5">{`${user.sFirstName} ${user.sLastName}`}</CardTitle>
                                <CardSubtitle tag="h6" className="mb-2 text-muted"><i>@{user.sUsername}</i></CardSubtitle><br />
                                <CardTitle tag="h6">Joined {moment(user.createdAt).fromNow()}</CardTitle >
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="8">
                        <Card className="edit-profile-card" style={{ borderColor: "white" }}>
                            <CardBody>
                                <CardTitle tag="h5" className="text-center text-muted">Edit Profile</CardTitle>
                                <Form onSubmit={this.handleSubmit}>
                                    <FormGroup>
                                        <Label for="sFirstName">First Name</Label>
                                        <Input id="sFirstName" name="sFirstName" invalid={errors.sFirstName ? true : false} onChange={this.handleChange} value={user.sFirstName} />
                                        <FormFeedback></FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="sLastName">Last Name</Label>
                                        <Input id="sLastName" name="sLastName" invalid={errors.sLastName ? true : false} onChange={this.handleChange} value={user.sLastName} />
                                        <FormFeedback></FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        <Label for="sUsername">Username</Label>
                                        <Input id="sUsername" name="sUsername" invalid={errors.sUsername ? true : false} onChange={this.handleChange} value={user.sUsername} />
                                        <FormFeedback></FormFeedback>
                                    </FormGroup>
                                    <FormGroup>
                                        {
                                            response.message ?
                                                (response.status > 400 ?
                                                    (<div className="alert alert-danger">{response.message}</div>)
                                                    : (<div className="alert alert-success">{response.message}</div>))
                                                : (null)
                                        }
                                    </FormGroup>
                                    <Button color="primary" className="float-right">Save Changes</Button>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    };
}

export default Profile;