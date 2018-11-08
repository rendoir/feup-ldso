/**  
* @jest-environment jsdom  
*/
import 'react-native';
import React from 'react';
import EventScreen from '../EventScreen';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';

Enzyme.configure({ adapter: new Adapter() });

var mockAxios = new MockAdapter(axios);


describe('App snapshot', () => {
    jest.useFakeTimers();
    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
    });

    it('renders loading', async () => {
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
        const wrapper = shallow(<EventScreen />);

        wrapper.state().loading = true;

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly', async () => {
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

});
