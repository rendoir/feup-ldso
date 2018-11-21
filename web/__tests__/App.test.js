import React from 'react';
import rendered from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../src/NavbarComponent';
import ListEvents from '../src/ListEvents';
import AddEventForm from '../src/AddEventForm';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';

import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

var mockAxios = new MockAdapter(axios);

it('renders elements', () => {

    mockAxios.onGet().reply(200, {
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
    });


    const navbarComponent = rendered.create(
        <BrowserRouter>
            <Navbar />
        </BrowserRouter>);
    let tree = navbarComponent.toJSON();
    expect(tree).toMatchSnapshot();

    const listEvents = rendered.create(
        <BrowserRouter>
            <ListEvents
                refreshListEvents={false}
                updateRefreshEvents={false}
                categories={[]}
                entities={[]}
            />
        </BrowserRouter>
    );
    let treeList = listEvents.toJSON();
    expect(treeList).toMatchSnapshot();

    const AddForm = rendered.create(
        <BrowserRouter>
            <AddEventForm
                displayForm={true}
                categories={[]}
                entities={[{ key: 0, value: 1, text: 'Test' }]}
            />
        </BrowserRouter>
    );
    let treeForm = AddForm.toJSON();
    expect(treeForm).toMatchSnapshot();
});
