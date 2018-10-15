import 'react-native';
import React from 'react';
import Event from '../Event';
import renderer from 'react-test-renderer';

it('renders correctly', () => {
    eventData = {"id":2,"title":"Feup Career Fair 2018","description":"Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!","start_date":"2018-10-15T23:00:00.000Z","end_date":"2018-10-18T23:00:00.000Z","location":"FEUP","price":0,"entity_id":9,"poster_id":2};
    const tree = renderer.create(<Event data={eventData}/>).toJSON();

    expect(tree).toMatchSnapshot();
});