/**
* @jest-environment jsdom
*/
import 'react-native';
import React from 'react';
import { Linking } from 'react-native';
import { Permissions, Calendar } from "expo";
import EventScreen from '../EventScreen';
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
        global.dictionary["PRICE"] = jest.fn(() => "");
    });

    it('renders loading', async() => {
        const wrapper = shallow(<EventScreen screenProps={{ language: 'PT' }} />);

        wrapper.setState({
            loading: true
        });

        expect(wrapper).toMatchSnapshot();
    });

    it('renders correctly', async() => {
        const wrapper = shallow(<EventScreen screenProps={{ language: 'PT' }} />);

        wrapper.state().loading = false;

        expect(wrapper).toMatchSnapshot();
    });


    it('unmounts correctly', () => {
        const tree = renderer.create(<EventScreen screenProps={{ language: 'PT' }} />).getInstance();
        tree.componentWillUnmount();
        expect(tree.isCancelled).toEqual(true);
    });

    it('get date with end_date === null', () => {
        const wrapper = shallow(<EventScreen screenProps={{ language: 'PT' }} />);
        const event = {
            id: 1,
            title: "Concerto Jogo de Damas apresenta",
            description: "Jogo de Damas – grupo vocal do Porto",
            start_date: "2019-01-12T21:30:00.000Z",
            end_date: null,
            location: "Auditório FEUP",
            price: 0,
            entity_id: 9,
            user_id: 1,
            entity: { initials: 'FEUP' }
        };

        const date = wrapper.instance().getEventDate(event);

        expect(date).toEqual('12-01-2019');

    });

    it('get date with end_date !== null', () => {
        const wrapper = shallow(<EventScreen screenProps={{ language: 'PT' }} />);
        const event = {
            id: 1,
            title: "Concerto Jogo de Damas apresenta",
            description: "Jogo de Damas – grupo vocal do Porto",
            start_date: "2019-01-12T21:30:00.000Z",
            end_date: "2019-01-13T21:30:00.000Z",
            location: "Auditório FEUP",
            price: 0,
            entity_id: 9,
            user_id: 1,
            entity: { initials: 'FEUP' }
        };

        const date = wrapper.instance().getEventDate(event);

        expect(date).toEqual('12-01-2019 até 13-01-2019');

    });

    it('image load error', () => {

        const wrapper = shallow(<EventScreen screenProps={{ language: 'PT' }} />);

        wrapper.instance().ImageLoadingError();

        expect(wrapper.state().imageLoaded).toEqual(false);
    });

    it('open map app', () => {

        jest.mock('Platform', () => {
            const Platform = require.requireActual('Platform');
            Platform.OS = 'android';
            return Platform;
        });

        const wrapper = shallow(<EventScreen screenProps={{ language: 'PT' }} />);

        wrapper.setState({
            loading: false,
            event: {
                title: "Event",
                descritpion: "Event",
                start_date: '2018-10-27T11:11:00',
                end_date: '2018-10-28T11:11:00',
                price: 10,
                location: 'Letraria, Porto',
                entity: { initials: 'FEUP' }
            }
        });

        const spy = jest.spyOn(Linking, 'openURL');

        const buttonMap = wrapper.find(".map-button").first();
        buttonMap.props().onPress();

        expect(spy).toHaveBeenCalled();
    });

    it('add event to calendar - PT', async() => {

        const wrapper = shallow(<EventScreen screenProps={{ language: 'PT' }} />);

        let alertWithType = jest.fn();

        wrapper.setState({
            loading: false,
            event: {
                title: "Event",
                descritpion: "Event",
                start_date: '2018-10-27T11:11:00',
                end_date: '2018-10-28T11:11:00',
                price: 0,
                location: 'Letraria, Porto',
                entity: { initials: 'FEUP' }
            }
        });

        wrapper.instance().dropdown = { alertWithType: alertWithType };

        const spy = jest.spyOn(Permissions, 'askAsync');
        spy.mockImplementation(() => Promise.resolve({ status: "granted" }));

        const spyCalendar = jest.spyOn(Calendar, 'createEventAsync');
        spyCalendar.mockImplementation(() => Promise.resolve(83));

        const calendarMap = wrapper.find(".calendar-button").first();
        await calendarMap.props().onPress();

        expect(spy).toHaveBeenCalled();
        expect(spyCalendar).toHaveBeenCalled();
        expect(alertWithType).toHaveBeenLastCalledWith("success", "Sucesso", "Evento adicionado ao calendário!");
    });

    it('add event to calendar - EN', async() => {

        const wrapper = shallow(<EventScreen screenProps={{ language: 'EN' }} />);

        let alertWithType = jest.fn();

        wrapper.setState({
            loading: false,
            event: {
                title: "Event",
                descritpion: "Event",
                start_date: '2018-10-27T11:11:00',
                end_date: '2018-10-28T11:11:00',
                price: 0,
                location: 'Letraria, Porto',
                entity: { initials: 'FEUP' }
            }
        });

        wrapper.instance().dropdown = { alertWithType: alertWithType };

        const spy = jest.spyOn(Permissions, 'askAsync');
        spy.mockImplementation(() => Promise.resolve({ status: "granted" }));

        const spyCalendar = jest.spyOn(Calendar, 'createEventAsync');
        spyCalendar.mockImplementation(() => Promise.resolve(83));

        const calendarMap = wrapper.find(".calendar-button").first();
        await calendarMap.props().onPress();

        expect(spy).toHaveBeenCalled();
        expect(spyCalendar).toHaveBeenCalled();
        expect(alertWithType).toHaveBeenLastCalledWith("success", "Success", "Event added to calendar!");
    });

    it('add event to calendar - ERROR PERMISSION', async() => {

        const wrapper = shallow(<EventScreen screenProps={{ language: 'EN' }} />);

        let alertWithType = jest.fn();

        wrapper.setState({
            loading: false,
            event: {
                title: "Event",
                descritpion: "Event",
                start_date: '2018-10-27T11:11:00',
                end_date: '2018-10-28T11:11:00',
                price: 10,
                location: 'Letraria, Porto',
                entity: { initials: 'FEUP' }
            }
        });

        wrapper.instance().dropdown = { alertWithType: alertWithType };

        const spy = jest.spyOn(Permissions, 'askAsync');
        spy.mockImplementation(() => Promise.resolve({ status: "not granted" }));


        const calendarMap = wrapper.find(".calendar-button").first();
        await calendarMap.props().onPress();

        expect(spy).toHaveBeenCalled();
        expect(alertWithType).toHaveBeenLastCalledWith("error", "Error", "An error occured when adding event to calendar!");
    });

    it('add event to calendar - ERROR CALENDAR', async() => {

        const wrapper = shallow(<EventScreen screenProps={{ language: 'EN' }} />);

        let alertWithType = jest.fn();

        wrapper.setState({
            loading: false,
            event: {
                title: "Event",
                descritpion: "Event",
                start_date: '2018-10-27T11:11:00',
                end_date: '2018-10-28T11:11:00',
                price: 10,
                location: 'Letraria, Porto',
                entity: { initials: 'FEUP' }
            }
        });

        wrapper.instance().dropdown = { alertWithType: alertWithType };

        const spy = jest.spyOn(Permissions, 'askAsync');
        spy.mockImplementation(() => Promise.resolve({ status: "granted" }));

        const spyCalendar = jest.spyOn(Calendar, 'createEventAsync');
        spyCalendar.mockImplementation(() => Promise.resolve(null));

        const calendarMap = wrapper.find(".calendar-button").first();
        await calendarMap.props().onPress();

        expect(spy).toHaveBeenCalled();
        expect(spyCalendar).toHaveBeenCalled();
        expect(alertWithType).toHaveBeenLastCalledWith("error", "Error", "An error occured when adding event to calendar!");
    });

    it('get title english', async() => {

        const wrapper = shallow(<EventScreen screenProps={{ language: 'EN' }} />);
        wrapper.setState({
            loading: false,
            event: {
                title: "Event",
                title_english: "Event English",
                descritpion: "Event",
                description_english: "Description English",
                start_date: '2018-10-27T11:11:00',
                end_date: '2018-10-28T11:11:00',
                price: 10,
                location: 'Letraria, Porto',
                entity: { initials: 'FEUP' }
            }
        });

        expect(wrapper.instance().getTitle()).toEqual("Event English");
    });

    it('get description english', async() => {

        const wrapper = shallow(<EventScreen screenProps={{ language: 'EN' }} />);
        wrapper.setState({
            loading: false,
            event: {
                title: "Event",
                title_english: "Event English",
                descritpion: "Event",
                description_english: "Description English",
                start_date: '2018-10-27T11:11:00',
                end_date: '2018-10-28T11:11:00',
                price: 10,
                location: 'Letraria, Porto',
                entity: { initials: 'FEUP' }
            }
        });

        expect(wrapper.instance().getDescription()).toEqual("Description English");
    });

});
