/**
 * @jest-environment jsdom
 */

import 'react-native';
import React from 'react';
import Event from '../Event';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
Enzyme.configure({ adapter: new Adapter() });

var mockAxios = new MockAdapter(axios);

it('renders correctly', () => {
    eventData = { "id": 2, "title": "Feup Career Fair 2018", "description": "Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!", "start_date": "2018-10-15T23:00:00.000Z", "end_date": "2018-10-18T23:00:00.000Z", "location": "FEUP", "price": 0, "entity_id": 9, "poster_id": 2, "favorite": [1]  };
    const tree = renderer.create(<Event data={eventData} />).toJSON();

    expect(tree).toMatchSnapshot();
});

it('getMonthInString returns correctly', () => {
    eventData = { "id": 2, "title": "Feup Career Fair 2018", "description": "Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!", "start_date": "2018-10-15T23:00:00.000Z", "end_date": "2018-10-18T23:00:00.000Z", "location": "FEUP", "price": 0, "entity_id": 9, "poster_id": 2, "favorite": [1] };
    const tree = renderer.create(<Event data={eventData}  />).getInstance();

    expect(tree.getMonthInString('01')).toEqual("JAN");
    expect(tree.getMonthInString('02')).toEqual("FEV");
    expect(tree.getMonthInString('03')).toEqual("MAR");
    expect(tree.getMonthInString('04')).toEqual("ABR");
    expect(tree.getMonthInString('05')).toEqual("MAI");
    expect(tree.getMonthInString('06')).toEqual("JUN");
    expect(tree.getMonthInString('07')).toEqual("JUL");
    expect(tree.getMonthInString('08')).toEqual("AGO");
    expect(tree.getMonthInString('09')).toEqual("SET");
    expect(tree.getMonthInString('10')).toEqual("OUT");
    expect(tree.getMonthInString('11')).toEqual("NOV");
    expect(tree.getMonthInString('12')).toEqual("DEZ");
    expect(tree.getMonthInString('asjdnawd')).toEqual("Error");
});

it('image loading', () => {
    eventData = { "id": 2, "title": "Feup Career Fair 2018", "description": "Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!", "start_date": "2018-10-15T23:00:00.000Z", "end_date": "2018-10-18T23:00:00.000Z", "location": "FEUP", "price": 0, "entity_id": 9, "poster_id": 2, "favorite": [1]  };
    const tree = renderer.create(<Event data={eventData} />).getInstance();

    tree.ImageLoadingError();
    expect(tree.state.imageLoaded).toEqual(false);
});

it('event is favorited', () => {
    eventData = { "id": 2, "title": "Feup Career Fair 2018", "description": "Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!", "start_date": "2018-10-15T23:00:00.000Z", "end_date": "2018-10-18T23:00:00.000Z", "location": "FEUP", "price": 0, "entity_id": 9, "poster_id": 2, "favorite": [1]  };
    const wrapper = shallow(<Event data={eventData} />);
    
    expect(wrapper.state().isFavorite).toEqual(true); 
});

it('event is not favorited', () => {
    eventData = { "id": 2, "title": "Feup Career Fair 2018", "description": "Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!", "start_date": "2018-10-15T23:00:00.000Z", "end_date": "2018-10-18T23:00:00.000Z", "location": "FEUP", "price": 0, "entity_id": 9, "poster_id": 2, "favorite": []  };
    const wrapper = shallow(<Event data={eventData} />);
    
    expect(wrapper.state().isFavorite).toEqual(false); 
});

it('favorite an event works', async () => {
    mockAxios.onPost('http://' + global.api + ':3030/favorite').reply(200);

    jest.mock('expo', ()=>({
        SecureStore: {
           getItemAsync: jest.fn(() =>{ return 'asc'})
        }
      }))

    eventData = { "id": 2, "title": "Feup Career Fair 2018", "description": "Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!", "start_date": "2018-10-15T23:00:00.000Z", "end_date": "2018-10-18T23:00:00.000Z", "location": "FEUP", "price": 0, "entity_id": 9, "poster_id": 2, "favorite": []  };
    const wrapper = shallow(<Event data={eventData} />);
    const icon = wrapper.find('.fave_icon').first();
    icon.props().onPress();
    setImmediate(() => {
        expect(wrapper.state().isFavorite).toEqual(true);
    })
});

it('favorite an event fails', async () => {
    mockAxios.onPost('http://' + global.api + ':3030/favorite').reply(400);

    jest.mock('expo', ()=>({
        SecureStore: {
           getItemAsync: jest.fn(() =>{ return 'asc'})
        }
      }))

    eventData = { "id": 2, "title": "Feup Career Fair 2018", "description": "Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!", "start_date": "2018-10-15T23:00:00.000Z", "end_date": "2018-10-18T23:00:00.000Z", "location": "FEUP", "price": 0, "entity_id": 9, "poster_id": 2, "favorite": []  };
    const wrapper = shallow(<Event data={eventData} />);
    const icon = wrapper.find('.fave_icon').first();
    icon.props().onPress();
    setImmediate(() => {
        expect(wrapper.state().isFavorite).toEqual(false);
    })
});