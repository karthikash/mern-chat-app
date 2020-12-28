import { Component } from "react";
import { Form, FormGroup, FormFeedback, Label, Input, Button } from "reactstrap";
import { isAlpha } from "validator";
import { Constants } from '../../config';

class Register extends Component {

    constructor(props) {
        super(props);

        this.state = this.getInitialState();
    }

    getInitialState = () => ({
        data: {
            sFirstName: '',
            sLastName: '',
            sUsername: '',
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
        if (!isAlpha(data.sFirstName)) errors.sFirstName = 'First name must only contain alphabets.';
        if (data.sFirstName === '') errors.sFirstName = 'First name cannot be empty.';
        if (!isAlpha(data.sLastName)) errors.sLastName = 'Last name must only contain alphabets.';
        if (data.sLastName === '') errors.sLastName = 'Last name cannot be empty.';
        if (data.sUsername === '') errors.sUsername = 'Username cannot be empty.';
        if (data.sPassword.length < 8) errors.sPassword = 'Password must be atleast 8 characters.'
        if (data.sPassword === '') errors.sPassword = 'Password cannot be empty.';
        if (data.sPassword !== data.sConfirmPassword) errors.sConfirmPassword = `Passwords doesn't match.`;
        if (data.sConfirmPassword.length < 8) errors.sConfirmPassword.sPassword = 'Password must be atleast 8 characters.'
        if (data.sConfirmPassword === '') errors.sConfirmPassword = 'Password cannot be empty.';
        return errors;
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const { data } = this.state;
        const errors = this.validate();
        if (Object.keys(errors).length === 0) {
            delete data['sConfirmPassword'];
            const options = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify(data)
            };
            fetch(`${Constants.REACT_APP_API_BASE_URL}/auth/signup`, options)
                .then(async (success) => {
                    const response = await success.json();
                    this.setState({ response });
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
                    <Label for="sFirstName">First Name</Label>
                    <Input id="sFirstName" name="sFirstName" invalid={errors.sFirstName ? true : false} onChange={this.handleChange} value={data.sFirstName} />
                    <FormFeedback>{errors.sFirstName}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="sLastName">Last Name</Label>
                    <Input id="sLastName" name="sLastName" invalid={errors.sLastName ? true : false} onChange={this.handleChange} value={data.sLastName} />
                    <FormFeedback>{errors.sLastName}</FormFeedback>
                </FormGroup>
                <FormGroup>
                    <Label for="sUsername">Username</Label>
                    <Input id="sUsername" name="sUsername" invalid={errors.sUsername ? true : false} onChange={this.handleChange} value={data.sUsername} />
                    <FormFeedback>{errors.sUsername}</FormFeedback>
                </FormGroup>
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
                    <Button color="primary" block>Register</Button>
                </FormGroup>
            </Form>
        );
    };
}

export default Register;