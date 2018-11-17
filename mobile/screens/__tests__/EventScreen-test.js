/**
* @jest-environment jsdom
*/
import 'react-native';
import React from 'react';
import { Linking } from 'react-native';
import EventScreen from '../EventScreen';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
Enzyme.configure({ adapter: new Adapter() });

describe('App snapshot', () => {
    jest.useFakeTimers();
    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
    });

    it('renders loading', async() => {
        const wrapper = shallow(<EventScreen />);

        wrapper.setState({
            loading: true
        });

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly', async() => {
        const wrapper = shallow(<EventScreen />);

        wrapper.state().loading = false;

        expect(wrapper).toMatchSnapshot();
    });

    it('unmounts correctly', () => {
        const tree = renderer.create(<EventScreen />).getInstance();
        tree.componentWillUnmount();
        expect(tree.isCancelled).toEqual(true);
    });

    it('get date with end_date === null', () => {
        const wrapper = shallow(<EventScreen />);
        const event = {
            id: 1,
            title: "Concerto Jogo de Damas apresenta",
            description: "Jogo de Damas – grupo vocal do Porto",
            start_date: "2019-01-12T21:30:00.000Z",
            end_date: null,
            location: "Auditório FEUP",
            price: 0,
            entity_id: 9,
            user_id: 1
        };

        const date = wrapper.instance().getEventDate(event);

        expect(date).toEqual('12-01-2019');

    });

    it('get date with end_date !== null', () => {
        const wrapper = shallow(<EventScreen />);
        const event = {
            id: 1,
            title: "Concerto Jogo de Damas apresenta",
            description: "Jogo de Damas – grupo vocal do Porto",
            start_date: "2019-01-12T21:30:00.000Z",
            end_date: "2019-01-13T21:30:00.000Z",
            location: "Auditório FEUP",
            price: 0,
            entity_id: 9,
            user_id: 1
        };

        const date = wrapper.instance().getEventDate(event);

        expect(date).toEqual('12-01-2019 até 13-01-2019');

    });

    it('image load error', () => {

        const wrapper = shallow(<EventScreen />);

        wrapper.instance().ImageLoadingError();

        expect(wrapper.state().imageLoaded).toEqual(false);
    });

    it('image load error', () => {

        jest.mock('Platform', () => {
            const Platform = require.requireActual('Platform');
            Platform.OS = 'android';
            return Platform;
        });

        const wrapper = shallow(<EventScreen />);

        wrapper.setState({
            loading: false,
            event: {
                title: "Event",
                descritpion: "Event",
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                price: 10,
                location: 'Letraria, Porto'
            }
        });

        const spy = jest.spyOn(Linking, 'openURL');

        // Wrapper.instance().redirectGoogleMaps();
        const buttonMap = wrapper.find(".map-button").first();
        buttonMap.props().onPress();

        expect(spy).toHaveBeenCalled();
    });

});
