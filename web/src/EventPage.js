import React, { Component } from 'react';
import { Col, Row, Alert, Image, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import './EventPage.css';

const monthNames = ["JANEIRO", "FEBREIRO", "MARÇO", "ABRIL", "MAIO", "JUNHO",
    "JULHO", "AGOSTO", "SETEMBRO", "OUTUBRO", "NOVEMBRO", "DEZEMBRO"
];

class EventPage extends Component {

    constructor(props) {
        super(props);

        console.log(props.match.params)

        this.state = {
            id: props.match.params.id,
            title: "",
            description: "",
            entity_id: null,
            entity: null,
            end_date: "",
            start_date: "",
            location: "",
            price: null,
            categories: [],
            image: "http://localhost:3030/" + props.match.params.id,
            alertType: null,
            alertMessage: null
        }

    }

    componentDidMount() {
        axios.get('http://localhost:3030/events/' + this.state.id)
            .then((res) => {

                if (res.data === "") {
                    this.setState({ alertType: "danger", alertMessage: "Este evento não existe." })
                }
                else {

                    let date = new Date(res.data.start_date);
                    let stringDateStart = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();

                    let stringDateEnd = null;
                    if (res.data.end_date !== null) {
                        date = new Date(res.data.start_date);
                        stringDateEnd = date.getDay() + "/" + date.getMonth() + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
                    }

                    this.setState({
                        title: res.data.title,
                        description: res.data.description,
                        start_date: stringDateStart,
                        end_date: stringDateEnd,
                        location: res.data.location,
                        price: res.data.price,
                        entity: res.data.entity,
                        entity_id: res.data.entity_id,
                        categories: res.data.categories
                    });

                }

            })
            .catch((err) => {
                this.setState({ alertType: "danger", alertMessage: "Ocorreu um erro. Por favor tente novamente." })
            })

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

        return (
            <div className="page-event">
                {alertElement}
                <Row>
                    <Col sm={8}>
                        <h2 className="event-title">{this.state.title}</h2>
                    </Col>
                    <Col sm={4}>
                        <Button><FontAwesomeIcon icon="edit" /></Button>
                        <Button className="delete-button"><FontAwesomeIcon icon="trash-alt" /></Button>
                    </Col>
                </Row>
                <Row>
                    <Col sm={5}>
                        <Image src={this.state.image} className="event-image" />
                    </Col>
                    <Col sm={7}>
                        <p className="event-description">{this.state.description}</p>
                    </Col>
                </Row>
                <Row>
                    <Col sm={5}>
                        <div className="event-date-hour">
                            <h4 className="display-inline">Dia/Hora: </h4>
                            <span>{this.state.start_date}</span>
                            <span> {this.state.end_date !== null ? "-" + this.state.end_date : ""}</span>
                        </div>
                        <div className="event-location">
                            <h4 className="display-inline">Localização: </h4>
                            <span>{this.state.location}</span>
                        </div>
                    </Col>
                    <Col sm={7}>

                    </Col>
                </Row>
            </div>
        )
    }
}

export default EventPage;