import React from 'react';
import ReactDOM from 'react-dom';
import AddEventForm from './AddEventForm';

it('renders form', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AddEventForm />, div);
  ReactDOM.unmountComponentAtNode(div);
});
