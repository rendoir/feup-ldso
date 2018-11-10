import React, { Component } from 'react';
import { Col, Row, Alert, Image, Button } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import swal from 'sweetalert';
import './EventPage.css';

class EventPage extends Component {

    constructor(props) {
        super(props);

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
            alertMessage: null,
            redirect: false,
            errorLoadingImage: true
        }

        this.deleteEvent = this.deleteEvent.bind(this);
        this.deleteEventConfirmed = this.deleteEventConfirmed.bind(this);
        this.getDefaultImage = this.getDefaultImage.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:3030/events/' + this.state.id)
            .then((res) => {

                if (res.data === "" || Object.keys(res.data).length === 0) {
                    this.setState({ alertType: "danger", alertMessage: "Este evento não existe." })
                }
                else {

                    let date = new Date(res.data.start_date);
                    let stringDateStart = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();

                    let stringDateEnd = null;
                    if (res.data.end_date !== null) {
                        date = new Date(res.data.end_date);
                        stringDateEnd = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
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


    deleteEvent() {
        swal({
            title: "Tem a certeza que quer apagar o evento?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        })
            .then((isConfirm) => {
                if (isConfirm)
                    this.deleteEventConfirmed();
            });
    }

    deleteEventConfirmed() {
        let self = this;
        axios.delete("http://localhost:3030/", {
            data: {
                user_id: 1,
                id: self.state.id
            }
        })
            .then((res) => this.setState({ redirect: true }))
            .catch((err) => self.setState({ alertType: "danger", alertMessage: "Um erro ocorreu a apagar o evento. Tente mais tarde." }))
    }

    getDefaultImage() {
        if (this.state.errorLoadingImage) {
            let image = document.querySelector('img.event-image');
            image.src = "/default.png";
            this.setState({ errorLoadingImage: false })
        }
    }


    render() {

        if (this.state.redirect) {
            return <Redirect to="/events" push />
        }

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

                    </Col>Ocorreu um erro. Por favor tente novamente.
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
                        <Button className="delete-button" onClick={this.deleteEvent}>
                            <FontAwesomeIcon icon="trash-alt" />
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col sm={5}>
                        <Image
                            src={'http://localhost:3030/' + this.state.id}
                            className="event-image"
                            onError={this.getDefaultImage}
                        />

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