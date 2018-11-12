import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Navbar from './NavbarComponent';
import LogIn from './LogIn';
import AddEventForm from './AddEventForm';
import ListEvents from './ListEvents';
import EventPage from './EventPage';
import './App.css';

import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignOutAlt, faEdit, faTrashAlt, faSearch } from '@fortawesome/free-solid-svg-icons';
library.add(faSignOutAlt, faEdit, faTrashAlt, faSearch);

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      refreshListEvents: false,
      categories: [],
      entities: []
    }

    this.updateRefreshEvents = this.updateRefreshEvents.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getEntities = this.getEntities.bind(this);
  }

  componentDidMount() {
    this.getCategories();
    this.getEntities();
  }

  updateRefreshEvents(value) {
    this.setState({ refreshListEvents: value });
  }

  getCategories() {
    axios.get('http://localhost:3030/categories')
      .then((res) => this.setState({ categories: res.data.map((obj, i) => { return { key: i, value: obj.id, text: obj.name } }) }))
      .catch((err) => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível mostrar as categorias.' }));

  }

  getEntities() {
    axios.get('http://localhost:3030/entities/' + 1)
      .then((res) => this.setState({ entities: res.data.map((obj, i) => { return { key: i, value: obj.id, text: obj.initials } }) }))
      .catch((err) => this.setState({ alertType: "danger", alertMessage: 'Ocorreu um erro. Não foi possível mostrar as entidades.' }));

  }

  getTokenFromCookie() {
    let token = document.cookie.split("access_token=")[1];
    return token;
  }


  render() {

  
    return (
      <div className="App">
        <Route component={Navbar} />
        <Switch>
          <Route exact path="/" component={LogIn} />
          <Route path="/events" render={() =>
            <ListEvents
              refreshListEvents={this.state.refreshListEvents}
              updateRefreshEvents={this.updateRefreshEvents}
              categories={this.state.categories}
              entities={this.state.entities}
            />
          } />
          <Route path="/create" render={() =>
            <AddEventForm
              categories={this.state.categories}
              entities={this.state.entities}
            />
          } />
          <Route path="/event/:id" component={EventPage}/>
        </Switch>
      </div>
    );
  }
}

export default App;
