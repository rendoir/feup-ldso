/**
 * @jest-environment jsdom
 */
import 'react-native';
import React from 'react';
import EntitiesScreen from '../EntitiesScreen';
import Entity from '../../components/Entity';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import '../../global.js';

Enzyme.configure({ adapter: new Adapter() });
var mockAxios = new MockAdapter(axios);

let entities = [
    {
        id: 1,
        initials: "FEUP"
    },
    {
        id: 2,
        initials: "FMUP"
    },
    {
        id: 3,
        initials: "FLUP"
    }
];

describe('App snapshot', () => {
    jest.useFakeTimers();
    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
    });

    it('renders correctly', async() => {
        const tree = renderer.create(<EntitiesScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});

describe('Get Entities', () => {

    it('get entities from api and saves them', async() => {

        mockAxios.onGet().reply(200, entities);

        let wrapper = await shallow(<EntitiesScreen screenProps={{ language: 'PT' }} />);

        await wrapper.instance().getEntitiesFromApi();

        setImmediate(() => {
            expect(wrapper.state().entities.length).toEqual(3);
        });

    });

});

describe('Get Entities Navigation', () => {

    it('entity press navigation', async() => {

        mockAxios.onGet().reply(200, entities);

        const navigate = jest.fn();
        const navigation = { navigate: navigate, state: { params: { onSelect: jest.fn() } } };
        let wrapper = await shallow(<EntitiesScreen screenProps={{ language: 'PT' }} navigation={navigation} />);

        wrapper.setState({ loading: false, entities: entities });

        let entity = wrapper.find(Entity).first();
        entity.props().onPress();

        expect(navigate).toHaveBeenCalled();

    });

    it('list item press navigation', async() => {

        mockAxios.onGet().reply(200, entities);

        const navigate = jest.fn();
        const navigation = { navigate: navigate, state: { params: { onSelect: jest.fn() } } };
        let wrapper = await shallow(<EntitiesScreen screenProps={{ language: 'PT' }} navigation={navigation} />);
        wrapper.setState({ loading: false, entities: entities });

        let list = wrapper.find(".list-entities").first();
        list.props().onPress();

        expect(navigate).toHaveBeenCalled();

        wrapper.unmount();

    });

    it('button all categories navigation', async() => {

        mockAxios.onGet().reply(200, entities);

        const navigate = jest.fn();
        const navigation = { navigate: navigate, state: { params: { onSelect: jest.fn() } } };
        let wrapper = await shallow(<EntitiesScreen screenProps={{ language: 'PT' }} navigation={navigation} />);
        wrapper.setState({ loading: false, entities: entities });

        let button = wrapper.find(".all-entities").first();
        button.props().onPress();

        expect(navigate).toHaveBeenCalled();

    });


});
