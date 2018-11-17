/**
* @jest-environment jsdom
*/
import 'react-native';
import React from 'react';
import AgendaScreen from '../AgendaScreen';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

var mockAxios = new MockAdapter(axios);


describe('App snapshot', () => {
    jest.useFakeTimers();
    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
    });

    it('renders correctly', async() => {
        const wrapper = shallow(<AgendaScreen />);
        expect(wrapper).toMatchSnapshot();
    });

    it('mounts correctly', () => {
        const mockFn = jest.fn('didFocusSubscription');
        let i = 0;
        if (i == 1)
            mockFn();
        const tree = renderer.create(<AgendaScreen />).getInstance();
        setImmediate(() => {
            tree.componentDidMount();
            expect(tree.state.isCancelled).toEqual(false);
            expect(tree.state.loading).toEqual(false);
        });
    });

    it('unmounts correctly', () => {
        const mockFn = jest.fn('didFocusSubscription');
        let i = 0;
        if (i == 1)
            mockFn();
        const tree = renderer.create(<AgendaScreen />).getInstance();
        setImmediate(() => {
            tree.componentWillUnmount();
            expect(tree.state.isCancelled).toEqual(true);
        });
    });

    it('renders list events', () => {
        const mockFn = jest.fn('didFocusSubscription');
        let i = 0;
        if (i == 1)
            mockFn();
        mockAxios.onGet('http://localhost:3030/events?').reply(200, {
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

        const events = renderer.create(
            <AgendaScreen
                loading={true}
                category={null}
                entity={null}
            />
        );
        let tree = events.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('check entity and category update', () => {
        const mockFn = jest.fn('didFocusSubscription');
        let i = 0;
        if (i == 1)
            mockFn();
        const tree = renderer.create(<AgendaScreen />).getInstance();
        setImmediate(() => {
            tree.props.navigation.setParams({ selectedEntityId: '1', selectedCategoryId: '2' });
            expect(tree.state.entity).toEqual(1);
            expect(tree.state.category).toEqual(2);
        });
    });

});

describe('Get events', () => {
    it('Get events from API', async() => {

        mockAxios.onGet().reply(200,
            [{
                id: 1,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP',
                is_favorite: true
            },
            {
                id: 2,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP',
                is_favorite: false
            },
            {
                id: 3,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP',
                favorite: [1]
            }]
        );

        const navigation = { getParam: jest.fn() };

        const wrapper = await shallow(<AgendaScreen
            loading={true}
            category={null}
            entity={null}
            navigation={navigation}
        />);


        await wrapper.instance().getEventsFromApi();

        expect(wrapper.state().events.length).toEqual(3);
        expect(wrapper.state().events[2].is_favorite).toEqual(true);

    });
});

describe('Favorites', () => {
    it('Marks event as favorite - success', async() => {

        mockAxios.onPost('http://' + global.api + ':3030/favorite').reply(200);

        jest.mock('expo', () => ({
            SecureStore: {
                getItemAsync: jest.fn(() => { return 'asc'; })
            }
        }));

        const wrapper = shallow(<AgendaScreen
            loading={true}
            category={null}
            entity={null}
        />);

        await wrapper.setState({
            events: [{
                id: 1,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP',
                is_favorite: true
            },
            {
                id: 2,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP',
                is_favorite: false
            },
            {
                id: 3,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP',
                is_favorite: false
            }]
        });

        await wrapper.instance().onFavorite(1);

        expect(wrapper.state().events[0].is_favorite).toEqual(false);
    });

    it('Marks event as favorite - error', () => {

        mockAxios.onPost('http://' + global.api + ':3030/favorite').reply(400);

        jest.mock('expo', () => ({
            SecureStore: {
                getItemAsync: jest.fn(() => { return 'asc'; })
            }
        }));

        const wrapper = shallow(<AgendaScreen
            loading={true}
            category={null}
            entity={null}
        />);

        wrapper.setState({
            events: [{
                id: 1,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP',
                is_favorite: true
            },
            {
                id: 2,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP',
                is_favorite: false
            },
            {
                id: 3,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP',
                is_favorite: false
            }]
        });

        wrapper.instance().onFavorite(1);

        expect(wrapper.state().events[0].is_favorite).toEqual(true);
    });
});
