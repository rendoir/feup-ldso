/**
* @jest-environment jsdom
*/
import 'react-native';
import React from 'react';
import LogInScreen from '../LogInScreen';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import '../../global.js';

Enzyme.configure({ adapter: new Adapter() });

describe('App snapshot', () => {
    jest.useFakeTimers();
    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
        const global = jest.genMockFromModule('../../global.js');
        global.dictionary = jest.fn(() => "");
    });

    it('renders correctly', async() => {
        const wrapper = shallow(<LogInScreen />);
        expect(wrapper).toMatchSnapshot();
    });

    it('renders loading', async() => {
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
        const tree = renderer.create(<LogInScreen language={'PT'}/>).getInstance();
        tree.componentWillUnmount();
        expect(tree.isCancelled).toEqual(true);
    });

    it('navigates correctly', () => {
        let signIn = jest.fn();
        const tree = shallow(<LogInScreen language={'PT'} signIn={signIn}/>);

        let button = tree.find(".login_button").first();
        button.props().onPress();

        expect(signIn).toHaveBeenCalled();
    });

});
