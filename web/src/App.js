import React, { Component } from 'react';
import Navbar from './NavbarComponent';
import { Route, Switch } from 'react-router-dom';
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

    this.toggleAddEventFormShowFlag = this.toggleAddEventFormShowFlag.bind(this);
    this.updateRefreshEvents = this.updateRefreshEvents.bind(this);
    this.showEventPage = this.showEventPage.bind(this);
    this.getCategories = this.getCategories.bind(this);
    this.getEntities = this.getEntities.bind(this);
  }

  componentDidMount() {
    this.getCategories();
    this.getEntities();
  }

  toggleAddEventFormShowFlag(value) {
    this.setState((prevState) =>
      ({ addEventFormShow: !prevState.addEventFormShow, showListEvents: !prevState.showListEvents, refreshListEvents: value }));
  }

  updateRefreshEvents(value) {
    this.setState({ refreshListEvents: value });
  }

  showEventPage(id) {
    //access API to get all information about an event
    this.setState({ addEventFormShow: false, showListEvents: false, showEventPage: true });
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


  render() {
    return (
      <div className="App">
        <Route component={Navbar} />
        <Switch>
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
