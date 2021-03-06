import React from 'react';
import rendered from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../src/NavbarComponent';
import ListEvents from '../src/ListEvents';
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
            entity: {
                initials: 'FEUP'
            }
        },
        {
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
        },
        {
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
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
});
