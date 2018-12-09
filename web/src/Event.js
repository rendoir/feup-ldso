import React, { Component } from 'react';
import { Col, Button, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import swal from 'sweetalert';
import './Event.css';

const monthNames = ["JANEIRO", "FEBREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
    "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

function getTokenFromCookie() {
    let token = document.cookie.split("access_token=")[1];
    return token;
}

class Event extends Component {

    constructor(props) {
        super(props);

        var date = new Date(props.start_date);

        this.state = {
            day: (date.getDate() < 10 ? '0' : '') + date.getDate(),
            month: monthNames[date.getMonth()],
            year: date.getFullYear()
        };
        this.deleteEvent = this.deleteEvent.bind(this);
        this.deleteEventRequest = this.deleteEventRequest.bind(this);
    }

    deleteEvent() {
        swal({
            title: "Tem a certeza que quer apagar o evento?",
            icon: "warning",
            buttons: true,
            dangerMode: true
        })
            .then((isConfirm) => {
                if (isConfirm)
                    this.deleteEventRequest();

            });
    }

    deleteEventRequest() {
        let self = this;
        axios.delete('http://' + process.env.REACT_APP_API_URL + ':3030/', {
            data: {
                id: self.props.id
            },
            headers: { 'Authorization': "Bearer " + getTokenFromCookie() }
        }).then(() => self.props.deleteEventFromArray(self.props.id))
            .catch((err) => self.props.updateAlertMessage('danger', 'Ocorreu um erro a apagar o evento.:' + err));
    }

    render() {
        return (
            <Row className="event">
                <Col sm={2} className="event-date">
                    <h4>{this.state.day}</h4>
                    <h4>{this.state.month}</h4>
                    <h4>{this.state.year}</h4>
                </Col>
                <Col sm={10} className="event-info">
                    <Link to={`/events/${this.props.id}`}>
                        <p className="event-title" onClick={this.props.showEventPage}>{this.props.title}</p>
                    </Link>
                    <p>{this.props.entity !== undefined ? this.props.entity.initials : this.props.initials}</p>

                    <div className="event-buttons">
                        <Link className="btn btn-link" to={{
                            pathname: `/events/${this.props.id}/edit`
                        }}>
                            <FontAwesomeIcon icon="edit" />
                        </Link>
                        <Button onClick={this.deleteEvent} className="delete-button"><FontAwesomeIcon icon="trash-alt" /></Button>
                    </div>
                </Col>
            </Row>
        );
    }
}

export default Event;
