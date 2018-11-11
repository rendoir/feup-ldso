import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Navbar from 'react-bootstrap/lib/Navbar';
import { Nav, Button, Image } from 'react-bootstrap';
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './NavbarComponent.css';
bootstrapUtils.addStyle(Navbar, 'custom');


class NavbarComponent extends Component {
  render() {
    return (
      <Navbar id="navbar-custom">
        <Navbar.Brand href="#">
          <NavLink className="navbar-brand" to="/events">
            <Image src="/logo.png" id="logo" />
          </NavLink>
        </Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav></Nav>

          <Nav>
            <Button><FontAwesomeIcon icon="sign-out-alt" /></Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavbarComponent;
