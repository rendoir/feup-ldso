/**
 * @jest-environment jsdom
 */
import 'react-native';
import React from 'react';
import CategoriesScreen from '../CategoriesScreen';
import Category from '../../components/Category';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import '../../global.js';

Enzyme.configure({ adapter: new Adapter() });
var mockAxios = new MockAdapter(axios);

let categories = [
    {
        id: 1,
        name: "Category 1"
    },
    {
        id: 2,
        name: "Category 2"
    },
    {
        id: 3,
        name: "Category 3"
    }
];

describe('App snapshot', () => {

    jest.useFakeTimers();

    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
    });

    it('renders correctly', async() => {
        const navigation = { navigate: jest.fn() };
        let tree = shallow(<CategoriesScreen screenProps={{ language: 'PT' }} navigation={navigation} />);
        tree.setState({ loading: false });
        expect(tree).toMatchSnapshot();
    });

    it('renders correctly with categories', async() => {
        const navigation = { navigate: jest.fn() };
        let tree = shallow(<CategoriesScreen screenProps={{ language: 'PT' }} navigation={navigation} />);
        tree.setState({ loading: false, categories: categories });
        expect(tree).toMatchSnapshot();
    });
});

describe('Get Categories', () => {

    it('get categories from api and saves them', async() => {

        mockAxios.onGet().reply(200, categories);

        let wrapper = await shallow(<CategoriesScreen screenProps={{ language: 'PT' }} />);

        await wrapper.instance().getCategoriesFromApi();

        setImmediate(() => {
            expect(wrapper.state().categories.length).toEqual(3);
        });

    });

});

describe('Get Categories Navigation', () => {

    it('category press navigation', async() => {

        mockAxios.onGet().reply(200, categories);

        const navigate = jest.fn();
        const navigation = { navigate: navigate, state: { params: { onSelect: jest.fn() } } };
        let wrapper = await shallow(<CategoriesScreen screenProps={{ language: 'PT' }} navigation={navigation} />);
        wrapper.setState({ loading: false, categories: categories });

        let category = wrapper.find(Category).first();
        category.props().onPress();

        expect(navigate).toHaveBeenCalled();

    });

    it('list item press navigation', async() => {

        mockAxios.onGet().reply(200, categories);

        const navigate = jest.fn();
        const navigation = { navigate: navigate, state: { params: { onSelect: jest.fn() } } };
        let wrapper = await shallow(<CategoriesScreen screenProps={{ language: 'PT' }} navigation={navigation} />);
        wrapper.setState({ loading: false, categories: categories });

        let list = wrapper.find(".list-categories").first();
        list.props().onPress();

        expect(navigate).toHaveBeenCalled();

        wrapper.unmount();

    });

    it('button all categories navigation', async() => {

        mockAxios.onGet().reply(200, categories);

        const navigate = jest.fn();
        const navigation = { navigate: navigate, state: { params: { onSelect: jest.fn() } } };
        let wrapper = await shallow(<CategoriesScreen screenProps={{ language: 'PT' }} navigation={navigation} />);
        wrapper.setState({ loading: false, categories: categories });

        let button = wrapper.find(".all-categories").first();
        button.props().onPress();

        expect(navigate).toHaveBeenCalled();

    });


});
