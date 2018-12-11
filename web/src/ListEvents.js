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
            fixedSearchInput: "",
            events: [],
            chosenCategories: [],
            chosenEntities: [],
            alertType: '',
            alertMessage: '',
            activePage: 0,
            pageCount: 0,
            searching: false
        };

        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeEntity = this.handleChangeEntity.bind(this);
        this.searchEventText = this.searchEventText.bind(this);
        this.deleteEventFromArray = this.deleteEventFromArray.bind(this);
        this.updateAlertMessage = this.updateAlertMessage.bind(this);
        this.handlePagination = this.handlePagination.bind(this);
        this.deleteSearchText = this.deleteSearchText.bind(this);
        this.getFilteredEvents = this.getFilteredEvents.bind(this);
        this.getTextSearchEvents = this.getTextSearchEvents.bind(this);
    }

    componentDidMount() {
        this.getFilteredEvents();
    }

    componentDidUpdate() {
        if (this.props.refreshListEvents) {
            this.getFilteredEvents();
            this.props.updateRefreshEvents(false);
        }
    }

    handleChangeSearch(event) {
        this.setState({ searchInput: event.target.value });
    }

    handleChangeCategory(event) {
        this.setState({ chosenCategories: event, searchInput: "", fixedSearchInput: "", searching: false }, this.getFilteredEvents);
    }

    handleChangeEntity(event) {
        this.setState({ chosenEntities: event, searchInput: "", fixedSearchInput: "", searching: false }, this.getFilteredEvents);
    }

    updateAlertMessage(newAlertType, newAlertMessage) {
        this.setState({ alertType: newAlertType, alertMessage: newAlertMessage });
    }

    handlePagination(event) {
        var page = event.target.getAttribute('value') - 1;

        if (this.state.searching) {

            this.setState({ activePage: page }, this.getTextSearchEvents);

        } else {

            this.setState({ activePage: page }, this.getFilteredEvents);

        }
    }

    searchEventText() {
        if (this.state.searchInput !== "") {

            let search = this.state.searchInput;

            axios.get('http://' + process.env.REACT_APP_API_URL + ':3030/search/events/web', {
                params: {
                    text: search,
                    page: 0,
                    limit: 5
                },
                headers: { 'Authorization': "Bearer " + getTokenFromCookie() }
            })
                .then((res) => this.setState({
                    chosenCategories: [], chosenEntities: [], fixedSearchInput: search,
                    events: res.data.rows, searching: true, pageCount: Math.ceil(res.data.count / 5), activePage: 0
                }))
                .catch(() => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível efetuar a pesquisa.' }));
        }
    }

    deleteSearchText() {
        this.setState({ searchInput: "", fixedSearchInput: "", searching: false, activePage: -1 });
        this.getFilteredEvents();
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

    getFilteredEvents() {
        axios.get('http://' + process.env.REACT_APP_API_URL + ':3030/web', {
            params: {
                offset: this.state.activePage * 5,
                limit: 5,
                entities: this.state.chosenEntities.map(a => a.value),
                categories: this.state.chosenCategories.map(a => a.value)
            },
            headers: { 'Authorization': "Bearer " + getTokenFromCookie() }
        })
            .then((res) => this.setState({ events: res.data.rows, pageCount: Math.ceil(res.data.count / 5) }))
            .catch(() => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível mostrar os eventos.' }));
    }

    getTextSearchEvents() {
        axios.get('http://' + process.env.REACT_APP_API_URL + ':3030/search/events/web', {
            params: {
                text: this.state.fixedSearchInput,
                page: this.state.activePage * 5,
                limit: 5
            },
            headers: { 'Authorization': "Bearer " + getTokenFromCookie() }
        })
            .then((res) => this.setState({ events: res.data.rows, searching: true, pageCount: Math.ceil(res.data.count / 5) }))
            .catch(() => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível efetuar a pesquisa.' }));
    }


    render() {

        if (document.cookie === undefined ||
            document.cookie.indexOf("access_token=") === -1) return <Redirect to={'/'} />;

        let stopSearchButton;
        if (this.state.searching) {
            stopSearchButton = <Button className="btn-stop-search" onClick={this.deleteSearchText}><FontAwesomeIcon icon="times" /></Button>;
        }

        let events = this.state.events.map((info) => (
            <Event key={info.id} {...info}
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
                                placeholder="Procurar Evento por título/descrição"
                                onChange={this.handleChangeSearch}
                            />
                            <Button className="btn-search" onClick={this.searchEventText}><FontAwesomeIcon icon="search" /></Button>
                            {stopSearchButton}
                        </FormGroup>
                    </Col>
                    <Col sm={4} className="dropdowns-search">
                        <Select classNamePrefix="categories" placeholder='Categorias' isMulti={true} closeMenuOnSelect={false} value={this.state.chosenCategories} onChange={this.handleChangeCategory} options={this.props.categories} />
                        <Select classNamePrefix="entities" placeholder='Entidades' isMulti={true} closeMenuOnSelect={false} value={this.state.chosenEntities} onChange={this.handleChangeEntity} options={this.props.entities} />
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
