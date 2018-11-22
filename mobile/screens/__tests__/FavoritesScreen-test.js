/**
* @jest-environment jsdom
*/
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FavoritesScreen from '../FavoritesScreen';

Enzyme.configure({ adapter: new Adapter() });

var mockAxios = new MockAdapter(axios);

describe('App snapshot', () => {
    jest.useFakeTimers();
    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
    });

    it('renders correctly', async() => {
        const wrapper = shallow(<FavoritesScreen />);
        expect(wrapper).toMatchSnapshot();
    });

    it('mounts correctly', () => {
        const mockFn = jest.fn('didFocusSubscription');
        let i = 0;
        if (i == 1)
            mockFn();
        const tree = renderer.create(<FavoritesScreen />).getInstance();
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
        const tree = renderer.create(<FavoritesScreen />).getInstance();
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
        mockAxios.onGet('http://localhost:3030/events/favorites?').reply(200, {
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
            <FavoritesScreen
                loading={true}
            />
        );
        let tree = events.toJSON();
        expect(tree).toMatchSnapshot();
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

        const wrapper = await shallow(<FavoritesScreen
            loading={true}
            navigation={navigation}
        />);

        await wrapper.instance().getFavoriteEvents();

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

        const wrapper = shallow(<FavoritesScreen
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

        const wrapper = shallow(<FavoritesScreen
            loading={true}
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

describe('Infinite scroll', () => {
    it('Handles scroll', async() => {

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

        const wrapper = await shallow(<FavoritesScreen
            loading={true}
            navigation={navigation}
        />);

        await wrapper.setState({ updateCall: true });
        await wrapper.instance().getFavoriteEvents();

        expect(wrapper.state().events.length).toEqual(3);

        const event = {
            isTrusted: true,
            type: "scroll",
            nativeEvent: {
                contentOffset: {
                    y: 1000
                }
            }
        };

        await wrapper.instance().handleScroll(event);

        expect(wrapper.state().events.length).toBeGreaterThanOrEqual(3);

    });

    it('Get more events on scroll handling', async() => {

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

        const wrapper = await shallow(<FavoritesScreen
            loading={true}
            navigation={navigation}
        />);

        await wrapper.instance().getFavoriteEvents();

        expect(wrapper.state().events.length).toEqual(3);

        let page = wrapper.state().eventsPage + 1;

        await wrapper.setState({ eventsPage: page });

        await wrapper.instance().getFavoriteEvents();

        expect(wrapper.state().events.length).toBeGreaterThanOrEqual(3);
    });
});

describe('Pull refresh', () => {
    it('Refreshes events on pull', async() => {

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

        const wrapper = await shallow(<FavoritesScreen
            loading={true}
            category={null}
            entity={null}
            navigation={navigation}
        />);

        await wrapper.instance().getFavoriteEvents();

        expect(wrapper.state().events.length).toEqual(3);

        let page = wrapper.state().eventsPage + 1;

        await wrapper.setState({ eventsPage: page });

        expect(wrapper.state().eventsPage).toEqual(1);

        await wrapper.instance()._onRefresh();

        expect(wrapper.state().eventsPage).toEqual(0);
    });
});
