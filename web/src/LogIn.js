import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, FormControl, Col, Button, Row, Alert } from 'react-bootstrap';
import axios from 'axios';
import './LogIn.css';

class LogIn extends Component {

    constructor(props) {
        super(props);

        this.state = {
            emailInput: "",
            passwordInput: "",
            alertType: null,
            alertMessage: null
        };

        this.updateEmailInput = this.updateEmailInput.bind(this);
        this.updatePasswordInput = this.updatePasswordInput.bind(this);
        this.handleLogIn = this.handleLogIn.bind(this);
    }

    updateEmailInput(event) {
        this.setState({ emailInput: event.target.value });
    }

    updatePasswordInput(event) {
        this.setState({ passwordInput: event.target.value });
    }

    handleLogIn(event) {
        event.preventDefault();

        let self = this;

        axios.post('http://' + process.env.REACT_APP_API_URL + ':3030/login', {
            email: self.state.emailInput,
            password: self.state.passwordInput
        })
            .then((res) => {
                document.cookie = 'access_token=' + res.data.token;
                self.setState({ alertType: 'success', alertMessage: "Successfully logged in!" });
            })
            .catch((err) => {
                self.setState({ alertType: 'danger', alertMessage: "Error logging in: " + err.response.data });
            });
    }

    render() {

        let alertElement;
        if (this.state.alertMessage !== null) {
            alertElement = (
                <Row>
                    <Col sm={4} md={2}>

                    </Col>
                    <Col sm={5} md={8}>
                        <Alert className={this.state.alertType}>
                            {this.state.alertMessage}
                        </Alert>
                    </Col>
                    <Col sm={4} md={2}>

                    </Col>
                </Row>);
        }

        if (document.cookie !== undefined &&
            document.cookie.indexOf("access_token=") !== -1) return <Redirect to={'/events'} />;

        return (
            <div id="login-container">
                {alertElement}
                <Row>
                    <Col sm={4}></Col>
                    <Col sm={4}>
                        <Form onSubmit={this.handleLogIn}>
                            <h2>Acontece na U.Porto</h2>
                            <FormControl type="email" required placeholder="Email"
                                value={this.state.emailInput} className="email-input" onChange={this.updateEmailInput} />

                            <FormControl type="password" required placeholder="Password"
                                value={this.state.passwordInput} className="password-input" onChange={this.updatePasswordInput} />

                            <Button variant="primary" type="submit"
                                id="login-button" className="primary_button">Entrar</Button>
                        </Form>
                    </Col>
                    <Col sm={4}></Col>
                </Row>
            </div>
        );

    }

}

export default LogIn;
