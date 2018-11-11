import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Col, Button, Row, Container, Alert } from 'react-bootstrap';
import { Dropdown, Pagination } from 'semantic-ui-react';
import axios from 'axios';
import Event from './Event';
import './ListEvents.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class ListEvents extends Component {

    constructor(props) {
        super(props);

        this.state = {
            searchInput: "",
            events: [],
            chosenCategories: [],
            chosenEntities: [],
            alertType: '',
            alertMessage: '',
            activePage: 0,
            pageCount: 0
        }

        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeEntity = this.handleChangeEntity.bind(this);
        this.searchEventText = this.searchEventText.bind(this);
        this.deleteEventFromArray = this.deleteEventFromArray.bind(this);
        this.updateAlertMessage = this.updateAlertMessage.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
    }

    componentDidMount() {
        //access API to get events with permission
        axios.get('http://localhost:3030/web/' + 1, {
            params: {
                page: 0,
                limit: 5
            }
        })
            .then((res) => this.setState({ events: res.data.events, pageCount: Math.ceil(res.data.count / 5) }))
            .catch((err) => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível mostrar os eventos.' }));
    }

    componentDidUpdate() {
        if (this.props.refreshListEvents) {
            axios.get('http://localhost:3030/web/' + 1, {
                params: {
                    page: 0,
                    limit: 5
                }
            })
                .then((res) => this.setState({ events: res.data.events, pageCount: Math.ceil(res.data.count / 5) }))
                .catch((err) => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível mostrar os eventos.' }));

            this.props.updateRefreshEvents(false);
        }

    }

    handleChangeSearch(event) {
        this.setState({ searchInput: event.target.value });
    }

    handleChangeCategory(event) {

    }

    handleChangeEntity(event) {

    }

    updateAlertMessage(newAlertType, newAlertMessage) {
        this.setState({ alertType: newAlertType, alertMessage: newAlertMessage });
    }

    handlePagination(event) {
        var page = event.target.getAttribute('value') - 1;
        axios.get('http://localhost:3030/web/' + 1, {
            params: {
                page: page * 5,
                limit: 5
            }
        })
            .then((res) => this.setState({ events: res.data.events, pageCount: Math.ceil(res.data.count / 5), activePage: page }))
            .catch((err) => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível mostrar os eventos.' }));

    }

    searchEventText() {
        //access API to get events with said text
    }

    deleteEventFromArray(event_id) {
        let index = -1;
        for (var i = 0; i < this.state.events.length; i++) {
            if (parseInt(this.state.events[i].id) === parseInt(event_id)) {
                index = i;
            }

        }

        if (index !== -1) {
            let eventsSliced;
            if (index === 0 && this.state.events.length === 1) {
                eventsSliced = [];
            }
            else {
                eventsSliced = this.state.events.splice(index, 1);
            }
            this.setState({
                events: eventsSliced,
                alertType: 'success', alertMessage: 'O evento foi apagado com sucesso.'
            });
        }
        else {
            this.setState({ alertType: 'danger', alertMessage: 'Ocorreu um erro. Por favor tente atualizar a página.' })
        }

    }


    render() {

        let events = this.state.events.map((info, i) => (
            <Event key={i} info={info}
                deleteEventFromArray={this.deleteEventFromArray}
                updateAlertMessage={this.updateAlertMessage}
            />
        ));

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
            <div id="list_events">
                {alertElement}
                <h1>Eventos</h1>
                <Row>
                    <Col sm={2}></Col>
                    <Col sm={1}>
                        <Link to={`/create`}>
                            <Button className="primary_button">Criar Evento</Button>
                        </Link>
                    </Col>
                    <Col sm={5}>
                        <Form.Group controlId="searchEvent" className="search-bar">
                            <Form.Control
                                id="search-text-input"
                                type="text"
                                value={this.state.searchInput}
                                placeholder="Procurar Evento"
                                onChange={this.handleChangeSearch}
                            />
                            <Button className="btn-search" onClick={this.searchEventText}><FontAwesomeIcon icon="search" /></Button>
                        </Form.Group>
                    </Col>
                    <Col sm={4} className="dropdowns-search">
                        <Dropdown placeholder='Categorias' fluid multiple search selection options={this.props.categories} onChange={this.handleChangeCategory} />
                        <Dropdown placeholder='Entidades' fluid multiple search selection options={this.props.entities} onChange={this.handleChangeEntity} />
                    </Col>
                </Row>

                <Container>
                    {events}
                    <Pagination
                        defaultActivePage={this.state.activePage + 1}
                        firstItem={null}
                        lastItem={null}
                        pointing
                        secondary
                        totalPages={this.state.pageCount}
                        onClick={this.handlePagination}
                    />
                </Container>
            </div>
        )
    }
}

export default ListEvents;
