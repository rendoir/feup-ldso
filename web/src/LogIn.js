import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, FormControl, Col, Button, Row, Alert, Image, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
                self.props.getEntities();
                self.props.getCategories();
            })
            .catch((err) => {
                if (err.response.data) {
                    self.setState({ alertType: 'danger', alertMessage: "Error logging in: " + err.response.data });
                } else {
                    self.setState({ alertType: 'danger', alertMessage: "Error logging in!" });
                }
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
                <Row>
                    {alertElement}
                    <Col sm={6} className="login-col-first">
                        <Image src="logotipo_completo.png" />
                    </Col>
                    <Col sm={6}>
                        <Form onSubmit={this.handleLogIn}>

                            <InputGroup>
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon">
                                        <FontAwesomeIcon icon="at" />
                                    </span>
                                </div>
                                <FormControl type="email" required placeholder="Email"
                                    value={this.state.emailInput} className="email-input"
                                    onChange={this.updateEmailInput} aria-describedby="basic-addon" />
                            </InputGroup>
                            <InputGroup>
                                <div className="input-group-prepend">
                                    <span className="input-group-text" id="basic-addon">
                                        <FontAwesomeIcon icon="unlock-alt" />
                                    </span>
                                </div>
                                <FormControl type="password" required placeholder="Password"
                                    value={this.state.passwordInput} className="password-input"
                                    onChange={this.updatePasswordInput} />
                            </InputGroup>


                            <Button variant="primary" type="submit"
                                id="login-button" className="primary_button">Entrar</Button>
                        </Form>
                    </Col>
                </Row>
            </div>
        );

    }

}

export default LogIn;
