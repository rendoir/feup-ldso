import React, { Component } from 'react';
import { Col, Button, Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Event.css';

const monthNames = ["JANEIRO", "FEBREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
  "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

class Event extends Component {

    constructor(props) {
        super(props);

        var date = new Date(props.info.start_date);

        this.state = {
            day: date.getDay(),
            month: monthNames[date.getMonth()],
            year: date.getFullYear()
        }
    }

    render() {
        return(
            <Row className="event">
                <Col sm={2} className="event-date">
                    <h4>{this.state.day}</h4>
                    <h4>{this.state.month}</h4>
                    <h4>{this.state.year}</h4>
                </Col>
                <Col sm={10} className="event-info">
                    <p className="event-title" onClick={this.props.showEventPage}>{this.props.info.title}</p>
                    <p>{this.props.info.initials}</p>

                    <div className="event-buttons">
                        <Button><FontAwesomeIcon icon="edit" /></Button>
                        <Button><FontAwesomeIcon icon="trash-alt" /></Button>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default Event;