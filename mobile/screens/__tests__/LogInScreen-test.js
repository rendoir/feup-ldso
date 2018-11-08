/**  
* @jest-environment jsdom  
*/
import 'react-native';
import React from 'react';
import LogInScreen from '../LogInScreen';
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

    it('renders correctly', async () => {
        const wrapper = shallow(<LogInScreen />);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders loading', async () => {
        const wrapper = shallow(<LogInScreen />);
        wrapper.setState({ loading: true });
        expect(wrapper).toMatchSnapshot();
    });

    it('mounts correctly', () => {
        const tree = shallow(<LogInScreen />);
        setImmediate(() => {
            tree.componentDidMount();
            expect(tree.state.isCancelled).toEqual(false);
            expect(tree.state.loading).toEqual(false);
        });
    });

    it('unmounts correctly', () => {
        const tree = renderer.create(<LogInScreen />).getInstance();
        tree.componentWillUnmount();
        expect(tree.isCancelled).toEqual(true);
    });

});
