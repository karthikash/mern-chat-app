import { Component } from "react";
import { Form, FormGroup, FormFeedback, Label, Input, Button } from "reactstrap";
import { Constants } from '../../config';

class Login extends Component {

    constructor(props) {
        super(props);

        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        data: {
            sUsername: '',
            sPassword: ''
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
        if (data.sUsername === '') errors.sUsername = 'Username cannot be empty.';
        if (data.sPassword.length < 8) errors.sPassword = 'Password must be atleast 8 characters.'
        if (data.sPassword === '') errors.sPassword = 'Password cannot be empty.';
        return errors;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { data } = this.state;
        const errors = this.validate();
        if (Object.keys(errors).length === 0) {
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                credentials: 'include',
                body: JSON.stringify(data)
            };
            fetch(`${Constants.REACT_APP_API_BASE_URL}/auth/signin`, options)
                .then(async (success) => {
                    const response = await success.json();
                    this.setState({ response });
                    if (response.status === 200) {
                        localStorage.setItem('_id', response._id);
                        localStorage.setItem('token', response.token);
                        localStorage.setItem('dp', response.sImage);
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
            <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                    <Label for="sUsername">Username</Label>
                    <Input id="sUsername" name="sUsername" invalid={errors.sUsername ? true : false} onChange={this.handleChange} value={data.sUsername} autoComplete="off" />
                    <FormFeedback>{errors.sUsername}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="sPassword">Password</Label>
                    <Input id="sPassword" name="sPassword" type="password" invalid={errors.sPassword ? true : false} onChange={this.handleChange} value={data.sPassword} autoComplete="off" />
                    <FormFeedback>{errors.sPassword}</FormFeedback>
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
                    <Button color="primary" block>Login</Button>
                </FormGroup>
            </Form>
        );
    };
}

export default Login;