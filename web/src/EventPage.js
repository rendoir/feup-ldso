import React, { Component } from 'react';
import { Col, Row, Alert, Image, Button, Breadcrumb } from 'react-bootstrap';
import { Redirect, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import swal from 'sweetalert';
import './EventPage.css';

function getTokenFromCookie() {
    let token = document.cookie.split("access_token=")[1];
    return token;
}

class EventPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.match.params.id,
            title: "",
            title_english: "",
            description: "",
            description_english: "",
            entity_id: null,
            entity: null,
            end_date_nonformat: "",
            start_date_nonformat: "",
            end_date: "",
            start_date: "",
            location: "",
            price: null,
            categories: [],
            image: null,
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
        axios.get('http://' + process.env.REACT_APP_API_URL + ':3030/events/' + this.state.id)
            .then((res) => {

                if (res.data === "" || Object.keys(res.data).length === 0) {
                    this.setState({ alertType: "danger", alertMessage: "Este evento não existe." });
                } else {

                    let date = new Date(res.data.start_date);
                    let dd = date.getDate();
                    let mm = date.getMonth() + 1;
                    let yyyy = date.getFullYear();
                    if (dd < 10) {
                        dd = '0' + dd;
                    }
                    if (mm < 10) {
                        mm = '0' + mm;
                    }
                    let stringDateStart = dd + "/" + mm + "/" + yyyy + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

                    let stringDateEnd = null;
                    if (res.data.end_date !== null) {
                        date = new Date(res.data.end_date);
                        dd = date.getDate();
                        mm = date.getMonth() + 1;
                        yyyy = date.getFullYear();
                        if (dd < 10) {
                            dd = '0' + dd;
                        }
                        if (mm < 10) {
                            mm = '0' + mm;
                        }
                        stringDateEnd = dd + "/" + mm + "/" + yyyy + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
                    }

                    this.setState({
                        title: res.data.title,
                        title_english: res.data.title_english,
                        description: res.data.description,
                        description_english: res.data.description_english,
                        start_date_nonformat: res.data.start_date,
                        end_date_nonformat: res.data.end_date,
                        start_date: stringDateStart,
                        end_date: stringDateEnd,
                        location: res.data.location,
                        price: res.data.price,
                        entity: res.data.entity,
                        entity_id: res.data.entity_id,
                        categories: res.data.categories,
                        image: "http://" + process.env.REACT_APP_API_URL + ":3030/" + this.state.id + "?" + Date.now()
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
        axios.delete('http://' + process.env.REACT_APP_API_URL + ':3030/', {
            data: {
                id: self.state.id
            },
            headers: { 'Authorization': "Bearer " + getTokenFromCookie() }
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
            return <span key={i} className="category-span">{cat.name}</span>;
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
                                <Breadcrumb.Item active>{this.state.title}</Breadcrumb.Item>
                            </Breadcrumb>
                        </Col>
                        <Col sm={4} md={2}>

                        </Col>
                    </Row>
                    <div id="page-event">
                        <Row className="event-page-header">
                            <Col sm={2}>
                            </Col>
                            <Col sm={8} className="event-title">
                                <h2>{this.state.title} / {this.state.title_english}</h2>
                                <div className="event-page-entities">
                                    <span>Entidade: </span><span className="event-page-entities-name">{this.state.entity.initials}</span>
                                </div>
                            </Col>
                            <Col sm={2}>
                            </Col>
                        </Row>
                        <Row className="event-page-body">
                            <Col sm={4}>
                                <Image
                                    src={this.state.image}
                                    className="event-image"
                                    onError={this.getDefaultImage}
                                />

                            </Col>
                            <Col sm={8}>
                                <p className="event-description">{this.state.description}</p>
                                <p className="event-description">{this.state.description_english}</p>
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
                                    <Button
                                        className="location-button"
                                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURI(this.state.location)}`}
                                        target="_blank"
                                        rel="noopener noreferrer">
                                        <FontAwesomeIcon icon="map-marked-alt" />
                                    </Button>
                                </div>
                            </Col>
                            <Col sm={5} className="event-page-ent-cat">
                                <div className="event-page-categories">
                                    <h4 className="display-inline">Categorias: </h4>
                                    {categories}
                                </div>
                                <div className="event-page-price">
                                    <h4 className="display-inline">Preço: </h4>
                                    <span>{this.state.price}€</span>
                                </div>
                            </Col>
                            <Col sm={2} className="event-page-buttons">
                                <Link className="btn btn-link btn-primary" to={{
                                    pathname: `/events/${this.state.id}/edit`,
                                    state: { event: this.state }
                                }}>
                                    <FontAwesomeIcon icon="edit" />
                                </Link>
                                <Button className="delete-button" onClick={this.deleteEvent}>
                                    <FontAwesomeIcon icon="trash-alt" />
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
