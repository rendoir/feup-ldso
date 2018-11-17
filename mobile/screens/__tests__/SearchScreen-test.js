/**
* @jest-environment jsdom
*/
import 'react-native';
import React from 'react';
import SearchScreen from '../SearchScreen';
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
        const mockFn = jest.fn('didFocusSubscription');
        let i = 0;
        if (i == 1)
            mockFn();
        const tree = renderer.create(<SearchScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('Do search', () => {
    it('/search Get events from API with specific search', async() => {

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

        const wrapper = await shallow(<SearchScreen />);

        await wrapper.setState({ searchText: "event" });

        await wrapper.instance().doSearch();
        await wrapper.update();

        setImmediate(() => {
            expect(wrapper.state().events.length).toEqual(3);
            expect(wrapper.state().events[2].is_favorite).toEqual(true);
        });

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

        const wrapper = shallow(<SearchScreen />);

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

        const wrapper = shallow(<SearchScreen />);

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
