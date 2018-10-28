import React from 'react';
import rendered from 'react-test-renderer';
import Navbar from './NavbarComponent';
import ListEvents from './ListEvents';
import AddEventForm from './AddEventForm';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

var mockAxios = new MockAdapter(axios);

it('renders elements', () => {

  mockAxios.onGet('http://localhost:3030/web/1').reply(200, {
    count: 3,
    events: [{
      title: 'Title',
      description: 'description',
      start_date: '2018-10-27 11:11:00',
      end_date: '2018-10-28 11:11:00',
      initials: 'FEUP'
    },
    {
      title: 'Title',
      description: 'description',
      start_date: '2018-10-27 11:11:00',
      end_date: '2018-10-28 11:11:00',
      initials: 'FEUP'
    },
    {
      title: 'Title',
      description: 'description',
      start_date: '2018-10-27 11:11:00',
      end_date: '2018-10-28 11:11:00',
      initials: 'FEUP'
    }]
  })


  const navbarComponent = rendered.create(<Navbar />);
  let tree = navbarComponent.toJSON();
  expect(tree).toMatchSnapshot();

  const listEvents = rendered.create(
    <ListEvents
      toggleAddEventFormShowFlag={null}
      displayListEvents={true}
      showEventPage={false}
      refreshListEvents={false}
      updateRefreshEvents={false}
      categories={[]}
      entities={[]}
    />
  );
  let treeList = listEvents.toJSON();
  expect(treeList).toMatchSnapshot();

  const AddForm = rendered.create(
    <AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }]}
    />
  );
  let treeForm = AddForm.toJSON();
  expect(treeForm).toMatchSnapshot();
});
