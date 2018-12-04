import React, { Component } from 'react';
import { NavLink, Route } from 'react-router-dom';
import axios from 'axios';
import Navbar from 'react-bootstrap/lib/Navbar';
import { Nav, Button, Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './NavbarComponent.css';


class NavbarComponent extends Component {

    constructor(props) {
        super(props);

        this.state = {};

        this.handleLogOut = this.handleLogOut.bind(this);
        this.getTokenFromCookie = this.getTokenFromCookie.bind(this);

    }

    getTokenFromCookie() {
        let token = document.cookie.split("access_token=")[1];
        return token;
    }

    handleLogOut(history) {

        axios({
            method: 'POST',
            url: 'http://' + process.env.REACT_APP_API_URL + ':3030/logout',
            headers: { 'Authorization': "Bearer " + this.getTokenFromCookie() }
        })
            .then(() => {
                document.cookie = "access_token =; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                history.push("/");
            })
            .catch(() => { });
    }

    render() {
        let logoutElement;

        if (document.cookie !== undefined &&
            document.cookie.indexOf("access_token=") !== -1) {

            logoutElement =
                <Route render={({ history }) =>
                    (<Button onClick={() => this.handleLogOut(history)}
                        id="logout-button"><FontAwesomeIcon icon="sign-out-alt" /></Button>)} />;
        }

        return (
            <Navbar id="navbar-custom">
                <NavLink className="navbar-brand" to="/events">
                    <Image src="/logotipo_agenda.png" id="logo" />
                </NavLink>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav></Nav>

                    <Nav>
                        {logoutElement}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }
}

export default NavbarComponent;
