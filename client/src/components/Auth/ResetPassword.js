import { Component } from "react";
import { Button, Col, Container, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import { Constants } from '../../config';

class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        data: {
            sPassword: '',
            sConfirmPassword: ''
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
            data: {
                ...this.state.data,
                [e.target.name]: e.target.value
            },
            errors: {
                ...this.state.errors,
                [e.target.name]: ''
            }
        });
    }

    validate = () => {
        const { data } = this.state;
        let errors = {};
        if (data.sPassword.length < 8) errors.sPassword = 'Password must be atleast 8 characters.'
        if (data.sPassword === '') errors.sPassword = 'Password cannot be empty.';
        if (data.sPassword !== data.sConfirmPassword) errors.sConfirmPassword = `Passwords doesn't match.`;
        if (data.sConfirmPassword.length < 8) errors.sConfirmPassword = 'Password must be atleast 8 characters.'
        if (data.sConfirmPassword === '') errors.sConfirmPassword = 'Password cannot be empty.';
        return errors;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { data } = this.state;
        const errors = this.validate();
        if (Object.keys(errors).length === 0) {
            delete data['sConfirmPassword'];
            const _id = localStorage.getItem('_id');
            const token = localStorage.getItem('token');
            const httpHeaders = {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${token}`
            }
            const options = {
                method: 'PUT',
                headers: new Headers(httpHeaders),
                body: JSON.stringify({
                    _id,
                    sPassword: data.sPassword
                })
            };
            fetch(`${Constants.REACT_APP_API_BASE_URL}/auth/reset/password`, options)
                .then(async (success) => {
                    const response = await success.json();
                    this.setState({ response });
                    if (response.status === 200) {
                        return window.location.assign('/chat');
                    }
                })
                .catch((error) => {
                    console.log('error: ', error);
                });
            this.setState(this.getInitialState());
        } else {
            this.setState({ errors });
        }
    }

    render() {
        const { data, errors, response } = this.state;
        return (
            <Container>
                <Row className="justify-content-md-center">
                    <Col md="4">
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label for="sPassword">Password</Label>
                                <Input id="sPassword" name="sPassword" type="password" invalid={errors.sPassword ? true : false} onChange={this.handleChange} value={data.sPassword} />
                                <FormFeedback>{errors.sPassword}</FormFeedback>
                            </FormGroup>
                            <FormGroup>
                                <Label for="sConfirmPassword">Confirm Password</Label>
                                <Input id="sConfirmPassword" name="sConfirmPassword" type="password" invalid={errors.sConfirmPassword ? true : false} onChange={this.handleChange} value={data.sConfirmPassword} />
                                <FormFeedback>{errors.sConfirmPassword}</FormFeedback>
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
                            <FormGroup>
                                <Button color="primary" block>ResetPassword</Button>
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default ResetPassword;