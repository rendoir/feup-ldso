import React, { Component } from 'react';
import Navbar from './NavbarComponent';
import AddEventForm from './AddEventForm';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      addEventFormShow: false
    }

    this.toggleAddEventFormShowFlag = this.toggleAddEventFormShowFlag.bind(this);
  }

  toggleAddEventFormShowFlag() {
    this.setState((prevState) => ({ addEventFormShow: !prevState.addEventFormShow }));
  }


  render() {
    return (
      <div className="App">
        <Navbar />

        <div id="new_event">
          <AddEventForm
            toggleAddEventFormShowFlag={this.toggleAddEventFormShowFlag}
          />
        </div>
      </div>
    );
  }
}

export default App;
