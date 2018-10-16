import React, { Component } from 'react';
import Navbar from 'react-bootstrap/lib/Navbar';
import { Nav, Button, Image } from 'react-bootstrap'; 
import { bootstrapUtils } from 'react-bootstrap/lib/utils';
import './NavbarComponent.css';
bootstrapUtils.addStyle(Navbar, 'custom');

class NavbarComponent extends Component {
  render() {
    return (
      <Navbar id="navbar-custom">
        <Navbar.Brand href="#"><Image src="/logo.png" id="logo"/></Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav>
            <Navbar.Text>
              FEUP
            </Navbar.Text>
          </Nav>

          <Nav>
            <Button>Logout</Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default NavbarComponent;
