import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { FormGroup, FormControl, Col, Button, Row, Alert } from 'react-bootstrap';
import { Pagination } from 'semantic-ui-react';
import Select from 'react-select';
import axios from 'axios';
import Event from './Event';
import './ListEvents.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function getTokenFromCookie() {
    let token = document.cookie.split("access_token=")[1];
    return token;
}

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
        };

        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeEntity = this.handleChangeEntity.bind(this);
        this.searchEventText = this.searchEventText.bind(this);
        this.deleteEventFromArray = this.deleteEventFromArray.bind(this);
        this.updateAlertMessage = this.updateAlertMessage.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
    }

    componentDidMount() {
        // Access API to get events with permission
        axios.get('http://' + process.env.REACT_APP_API_URL + ':3030/web', {
            params: {
                page: 0,
                limit: 5
            },
            headers: { 'Authorization': "Bearer " + getTokenFromCookie() }
        })
            .then((res) => this.setState({ events: res.data.events, pageCount: Math.ceil(res.data.count / 5) }))
            .catch(() => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível mostrar os eventos.' }));
    }

    componentDidUpdate() {
        if (this.props.refreshListEvents) {
            axios.get('http://' + process.env.REACT_APP_API_URL + ':3030/web', {
                params: {
                    page: 0,
                    limit: 5
                },
                headers: { 'Authorization': "Bearer " + getTokenFromCookie() }
            })
                .then((res) => this.setState({ events: res.data.events, pageCount: Math.ceil(res.data.count / 5) }))
                .catch(() => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível mostrar os eventos.' }));

            this.props.updateRefreshEvents(false);
        }

    }

    handleChangeSearch(event) {
        this.setState({ searchInput: event.target.value });
    }

    handleChangeCategory(event) {
        this.setState({ chosenCategories: event });
    }

    handleChangeEntity(event) {
        this.setState({ chosenEntities: event });
    }

    updateAlertMessage(newAlertType, newAlertMessage) {
        this.setState({ alertType: newAlertType, alertMessage: newAlertMessage });
    }

    handlePagination(event) {
        var page = event.target.getAttribute('value') - 1;
        axios.get('http://' + process.env.REACT_APP_API_URL + ':3030/web', {
            params: {
                page: page * 5,
                limit: 5
            },
            headers: { 'Authorization': "Bearer " + getTokenFromCookie() }
        })
            .then((res) => this.setState({ events: res.data.events, pageCount: Math.ceil(res.data.count / 5), activePage: page }))
            .catch(() => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível mostrar os eventos.' }));

    }

    searchEventText() {
        // Access API to get events with said text
    }

    deleteEventFromArray(event_id) {

        let eventsSliced = this.state.events.filter(function(value) {
            return parseInt(value.id) !== parseInt(event_id);
        });

        this.setState({
            events: eventsSliced,
            alertType: 'success', alertMessage: 'O evento foi apagado com sucesso.'
        });

    }


    render() {

        if (document.cookie === undefined ||
            document.cookie.indexOf("access_token=") === -1) return <Redirect to={'/'} />;


        let events = this.state.events.map((info, i) => (
            <Event key={i} {...info}
                deleteEventFromArray={this.deleteEventFromArray}
                updateAlertMessage={this.updateAlertMessage}
            />
        ));

        let alertElement = null;
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
                            <Button className="primary_button" id="create-event">Criar Evento</Button>
                        </Link>
                    </Col>
                    <Col sm={3}>
                        <FormGroup controlId="searchEvent" className="search-bar">
                            <FormControl
                                id="search-text-input"
                                type="text"
                                value={this.state.searchInput}
                                placeholder="Procurar Evento"
                                onChange={this.handleChangeSearch}
                            />
                            <Button className="btn-search" onClick={this.searchEventText}><FontAwesomeIcon icon="search" /></Button>
                        </FormGroup>
                    </Col>
                    <Col sm={4} className="dropdowns-search">
                        <Select placeholder='Categorias' isMulti={true} closeMenuOnSelect={false} onChange={this.handleChangeCategory} options={this.props.categories} />
                        <Select placeholder='Entidades' isMulti={true} closeMenuOnSelect={false} onChange={this.handleChangeEntity} options={this.props.entities} />
                    </Col>
                    <Col sm={2}></Col>
                </Row>

                <div className="container">
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
                </div>
            </div>
        );
    }
}

export default ListEvents;
