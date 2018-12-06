import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Navbar from './NavbarComponent';
import LogIn from './LogIn';
import AddEventForm from './AddEventForm';
import ListEvents from './ListEvents';
import EventPage from './EventPage';
import EventPageEdit from './EventPageEdit';
import './App.css';

import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignOutAlt, faEdit, faTrashAlt, faSearch, faTimes, faAt, faUnlockAlt } from '@fortawesome/free-solid-svg-icons';
library.add(faSignOutAlt, faEdit, faTrashAlt, faSearch, faTimes, faAt, faUnlockAlt);

function getTokenFromCookie() {
    let token = document.cookie.split("access_token=")[1];
    return token;
}

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            refreshListEvents: false,
            categories: [],
            entities: []
        };

        this.updateRefreshEvents = this.updateRefreshEvents.bind(this);
        this.getCategories = this.getCategories.bind(this);
        this.getEntities = this.getEntities.bind(this);
    }

    componentDidMount() {
        if (this.state.categories.length === 0) {
            this.getCategories();
        }
        if (this.state.entities.length === 0) {
            this.getEntities();
        }

    }

    updateRefreshEvents(value) {
        this.setState({ refreshListEvents: value });
    }

    getCategories() {
        axios.get('http://' + process.env.REACT_APP_API_URL + ':3030/categories')
            .then((res) => this.setState({ categories: res.data.map((obj) => { return { value: obj.id, label: obj.name }; }) }))
            .catch(() => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível mostrar as categorias.' }));

    }

    getEntities() {
        axios.get('http://' + process.env.REACT_APP_API_URL + ':3030/entities', {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': "Bearer " + getTokenFromCookie()
            }
        })
            .then((res) => this.setState({ entities: res.data.map((obj) => { return { value: obj.id, label: obj.initials }; }) }))
            .catch(() => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível mostrar as entidades.' }));

    }

    getTokenFromCookie() {
        let token = document.cookie.split("access_token=")[1];
        return token;
    }


    render() {


        return (
            <div className="App">
                <Switch>
                    <Route exact path="/" render={props => (
                        <LogIn
                            {...props}
                            getEntities={this.getEntities}
                            getCategories={this.getCategories}
                        />
                    )} />

                    <Route exact path="/events/:id" render={props => (
                        <div>
                            <Navbar {...props} />
                            <EventPage {...props} />
                        </div>
                    )} />

                    <Route path="/events/:id/edit" render={props =>
                        <div>
                            <Navbar {...props} />
                            <EventPageEdit
                                {...props}
                                allCategories={this.state.categories}
                                allEntities={this.state.entities}
                            />
                        </div>
                    } />

                    <Route path="/events" render={props => (
                        <div>
                            <Navbar {...props} />
                            <ListEvents
                                {...props}
                                refreshListEvents={this.state.refreshListEvents}
                                updateRefreshEvents={this.updateRefreshEvents}
                                categories={this.state.categories}
                                entities={this.state.entities}
                            />
                        </div>
                    )} />

                    <Route path="/create" render={props => (
                        <div>
                            <Navbar />
                            <AddEventForm
                                {...props}
                                categories={this.state.categories}
                                entities={this.state.entities}
                            />
                        </div>
                    )} />

                </Switch>
            </div>
        );
    }
}

export default App;
