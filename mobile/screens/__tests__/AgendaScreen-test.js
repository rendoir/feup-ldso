/**
* @jest-environment jsdom
*/
import 'react-native';
import React from 'react';
import AgendaScreen from '../AgendaScreen';
import EventComponent from '../../components/Event';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { shallow, mount } from 'enzyme';
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
        const navigation = { getParam: jest.fn(), navigate: jest.fn() };
        const wrapper = shallow(<AgendaScreen screenProps={{ language: 'PT' }} navigation={navigation}/>);
        expect(wrapper).toMatchSnapshot();
    });

    it('mounts correctly', () => {
        const mockFn = jest.fn('didFocusSubscription');
        let i = 0;
        if (i == 1)
            mockFn();

        const navigation = { getParam: jest.fn(), navigate: jest.fn() };
        const tree = renderer.create(<AgendaScreen screenProps={{ language: 'PT' }} navigation={navigation}/>).getInstance();
        setImmediate(() => {
            tree.componentDidMount();
            expect(tree.state.isCancelled).toEqual(false);
            expect(tree.state.loading).toEqual(false);
        });
    });

    it('mounts correctly without events', () => {

        const navigation = { getParam: jest.fn(), navigate: jest.fn() };

        const tree = mount(<AgendaScreen navigation={navigation} screenProps={{ language: 'PT' }} />);
        tree.instance().setState({ events: [] });

        setImmediate(() => {
            expect(tree).toMatchSnapshot();
            expect(tree.exists('.no-events')).toEqual(true);
        });
    });

    it('mounts correctly didFocus', () => {
        const navigation = {
            navigate: jest.fn(),
            getParam: jest.fn(() => ({
                id: 1,
                name: 'Categoria',
                name_english: 'Category 1'
            })),
            state: { params: { onSelect: jest.fn() } }
        };

        const tree = mount(<AgendaScreen navigation={navigation} screenProps={{ language: 'PT' }}/>);

        tree.instance().componentDidMount();

        setImmediate(() => {
            expect(tree.state.isCancelled).toEqual(false);
            expect(tree.state.loading).toEqual(false);
            expect(tree.instance().didFocusSubscription).toHaveBeenCalled();
        });
    });

    it('unmounts correctly', () => {
        const mockFn = jest.fn('didFocusSubscription');
        let i = 0;
        if (i == 1)
            mockFn();

        const navigation = { getParam: jest.fn(), navigate: jest.fn() };
        const tree = renderer.create(<AgendaScreen navigation={navigation}/>).getInstance();
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

        const navigation = { getParam: jest.fn(), navigate: jest.fn() };

        const events = renderer.create(
            <AgendaScreen
                loading={true}
                category={null}
                entity={null}
                navigation={navigation}
                screenProp={{ language: "PT" }}
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

        const navigation = { getParam: jest.fn(), navigate: jest.fn() };

        const wrapper = await shallow(<AgendaScreen
            loading={true}
            category={null}
            entity={null}
            navigation={navigation}
            screenProps={{ language: 'PT' }}
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

        const navigation = { getParam: jest.fn(), navigate: jest.fn() };

        const wrapper = shallow(<AgendaScreen
            loading={true}
            category={null}
            entity={null}
            navigation={navigation}
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

        const navigation = { getParam: jest.fn(), navigate: jest.fn() };

        const wrapper = shallow(<AgendaScreen
            loading={true}
            category={null}
            entity={null}
            navigation={navigation}
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

        const navigation = { getParam: jest.fn(), navigate: jest.fn() };

        const wrapper = await shallow(<AgendaScreen
            loading={true}
            category={null}
            entity={null}
            navigation={navigation}
        />);

        await wrapper.instance().getEventsFromApi();

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
        expect(wrapper.state().loadingEvents).toEqual(true);
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

        const navigation = { getParam: jest.fn(), navigate: jest.fn() };

        const wrapper = await shallow(<AgendaScreen
            loading={true}
            category={null}
            entity={null}
            navigation={navigation}
        />);

        await wrapper.instance().getEventsFromApi();

        expect(wrapper.state().events.length).toEqual(3);

        let page = wrapper.state().eventsPage + 1;

        await wrapper.setState({ eventsPage: page });

        expect(wrapper.state().eventsPage).toEqual(1);

        await wrapper.instance()._onRefresh();

        expect(wrapper.state().eventsPage).toEqual(0);
    });
});


describe('Get Category and Entity Names', () => {

    it('Category Name EN', () => {

        const navigation = {
            getParam: jest.fn(() => ({
                id: 1,
                name: 'Categoria',
                name_english: 'Category 1'
            })),
            navigate: jest.fn()
        };

        const wrapper = shallow(<AgendaScreen
            loading={true}
            category={null}
            entity={null}
            screenProps={{ language: 'EN' }}
            navigation={navigation}
        />);

        let category = wrapper.instance().getCategoryName();

        setImmediate(() => {
            expect(category).toEqual('Category 1');
        });

    });

    it('Category Name DEFAULT', () => {

        const navigation = {
            getParam: jest.fn(() => ({
                id: 1,
                name: 'all',
                name_english: 'all'
            })),
            navigate: jest.fn()
        };

        const wrapper = shallow(<AgendaScreen
            loading={true}
            category={null}
            entity={null}
            screenProps={{ language: 'PT' }}
            navigation={navigation}
        />);

        let category = wrapper.instance().getCategoryName();

        setImmediate(() => {
            expect(category).toEqual('all');
        });

    });

    it('Entity Name EN', () => {

        const navigation = { getParam: jest.fn(() => "Entity"), navigate: jest.fn() };

        const wrapper = shallow(<AgendaScreen
            loading={true}
            category={null}
            entity={null}
            screenProps={{ language: 'EN' }}
            navigation={navigation}
        />);

        let entity = wrapper.instance().getEntityName();

        setImmediate(() => {
            expect(entity).toEqual('Entity');
        });

    });

});

describe('Navigation tests', () => {

    it('Navigate to event page', () => {
        const navigate = jest.fn();
        const navigation = {
            navigate: navigate,
            getParam: jest.fn(() => ({
                id: 1,
                name: 'Categoria',
                name_english: 'Category 1'
            })),
            state: { params: { onSelect: jest.fn() } }
        };

        let wrapper = shallow(<AgendaScreen screenProps={{ language: 'PT' }} navigation={navigation} />);
        wrapper.setState({
            loading: false,
            events: [{
                id: 1,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP',
                is_favorite: true
            }]
        });

        let event = wrapper.find(EventComponent).first();
        event.props().onPress();

        expect(navigate).toHaveBeenCalled();
    });

    it('Navigate to categories screen', () => {
        const navigate = jest.fn();
        const navigation = {
            navigate: navigate,
            getParam: jest.fn(() => ({
                id: 1,
                name: 'Categoria',
                name_english: 'Category 1'
            })),
            state: { params: { onSelect: jest.fn(), toggleLanguage: jest.fn(), language: 'PT' } }
        };

        let wrapper = shallow(<AgendaScreen screenProps={{ language: 'PT' }} navigation={navigation} />);
        wrapper.setState({
            loading: false
        });

        let button = wrapper.find(".categories-button").first();
        button.props().onPress();

        expect(navigate).toHaveBeenCalled();
    });

    it('Navigate to entities screen', () => {
        const navigate = jest.fn();
        const navigation = {
            navigate: navigate,
            getParam: jest.fn(() => ({
                id: 1,
                name: 'Categoria',
                name_english: 'Category 1'
            })),
            state: { params: { onSelect: jest.fn(), toggleLanguage: jest.fn(), language: 'PT' } }
        };

        let wrapper = shallow(<AgendaScreen screenProps={{ language: 'PT' }} navigation={navigation} />);
        wrapper.setState({
            loading: false
        });

        let button = wrapper.find(".entities-button").first();
        button.props().onPress();

        expect(navigate).toHaveBeenCalled();
    });
});
