import React, { Component } from 'react';
import { Col, Row, Alert, Image, Button, Breadcrumb } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
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
        };

        this.deleteEvent = this.deleteEvent.bind(this);
        this.deleteEventConfirmed = this.deleteEventConfirmed.bind(this);
        this.getDefaultImage = this.getDefaultImage.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:3030/events/' + this.state.id)
            .then((res) => {

                if (res.data === "" || Object.keys(res.data).length === 0) {
                    this.setState({ alertType: "danger", alertMessage: "Este evento não existe." });
                } else {


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
            .catch(() => {
                this.setState({ alertType: "danger", alertMessage: "Ocorreu um erro. Por favor tente novamente." });
            });
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
            .then(() => this.setState({ redirect: true }))
            .catch(() => self.setState({ alertType: "danger", alertMessage: "Um erro ocorreu a apagar o evento. Tente mais tarde." }));
    }

    getDefaultImage() {
        if (this.state.errorLoadingImage) {
            let image = document.querySelector('img.event-image');
            image.src = "/default.png";
            this.setState({ errorLoadingImage: false });
        }
    }


    render() {

        if (this.state.redirect) {
            return <Redirect to="/events" push />;
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

        let categories = this.state.categories.map((cat, i) => {
            return <span key={i}>{cat.name}</span>;
        });


        if (this.state.title === "") {
            return (
                <div className="loading">
                    <div className="loader"></div>
                </div>
            );
        } else {

            return (
                <div>
                    {alertElement}
                    <Row>
                        <Col sm={4} md={2}>

                        </Col>
                        <Col sm={5} md={8}>
                            <Breadcrumb>
                                <Breadcrumb.Item>
                                    <Link to={`/events`}>
                                        Eventos
                                    </Link>
                                </Breadcrumb.Item>
                                <Breadcrumb.Item active>Criar Evento</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col sm={4} md={2}>

                        </Col>
                    </Row>
                    <div id="page-event">
                        <Row className="event-page-header">
                            <Col sm={8} className="event-title">
                                <h2>{this.state.title}</h2>
                            </Col>
                            <Col sm={4} className="event-page-buttons">
                                <Button><FontAwesomeIcon icon="edit" /></Button>
                                <Button className="delete-button" onClick={this.deleteEvent}>
                                    <FontAwesomeIcon icon="trash-alt" />
                                </Button>
                            </Col>
                        </Row>
                        <Row className="event-page-body">
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
                        <Row className="event-page-info">
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
                            <Col sm={5} className="event-page-ent-cat">
                                <div className="event-page-categories">
                                    <h4 className="display-inline">Categorias: </h4>
                                    {categories}
                                </div>
                                <div className="event-page-entities">
                                    <h4 className="display-inline">Entidade: </h4>
                                    <span>{this.state.entity.initials}</span>
                                </div>
                            </Col>
                            <Col sm={2} className="event-page-button-map">
                                <Button
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(this.state.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer">
                                    Ver no Mapa
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            );

        }

    }
}

export default EventPage;
