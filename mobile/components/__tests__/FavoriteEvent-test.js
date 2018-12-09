/**
 * @jest-environment jsdom
 */

import 'react-native';
import React from 'react';
import FavoriteEvent from '../FavoriteEvent';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import '../../global.js';

Enzyme.configure({ adapter: new Adapter() });


describe('Event Test', () => {

    it('renders correctly', () => {
        const eventData = { "id": 2, "title": "Feup Career Fair 2018", "description": "Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!", "start_date": "2018-10-15T23:00:00.000Z", "end_date": "2018-10-18T23:00:00.000Z", "location": "FEUP", "price": 0, "entity_id": 9, "user_id": 2, "is_favorite": true };
        const tree = renderer.create(<FavoriteEvent {...eventData} language='PT' />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders correctly in english', () => {
        const eventData = { "id": 2, "title": "Feup Career Fair 2018", "title_english": "Feup Career Fair 2018", "description": "Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!", "start_date": "2018-10-15T23:00:00.000Z", "end_date": "2018-10-18T23:00:00.000Z", "location": "FEUP", "price": 0, "entity_id": 9, "user_id": 2, "is_favorite": true };
        const tree = renderer.create(<FavoriteEvent {...eventData} language='EN' />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('getMonthInString returns correctly', () => {
        const eventData = { "id": 2, "title": "Feup Career Fair 2018", "description": "Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!", "start_date": "2018-10-15T23:00:00.000Z", "end_date": "2018-10-18T23:00:00.000Z", "location": "FEUP", "price": 1, "entity_id": 9, "user_id": 2, "is_favorite": true };
        const tree = renderer.create(<FavoriteEvent {...eventData} language='PT' />).getInstance();

        expect(tree.getMonthInString('01')).toEqual("Janeiro");
        expect(tree.getMonthInString('02')).toEqual("Fevereiro");
        expect(tree.getMonthInString('03')).toEqual("Março");
        expect(tree.getMonthInString('04')).toEqual("Abril");
        expect(tree.getMonthInString('05')).toEqual("Maio");
        expect(tree.getMonthInString('06')).toEqual("Junho");
        expect(tree.getMonthInString('07')).toEqual("Julho");
        expect(tree.getMonthInString('08')).toEqual("Agosto");
        expect(tree.getMonthInString('09')).toEqual("Setembro");
        expect(tree.getMonthInString('10')).toEqual("Outubro");
        expect(tree.getMonthInString('11')).toEqual("Novembro");
        expect(tree.getMonthInString('12')).toEqual("Dezembro");
    });

    it('image loading', () => {
        const eventData = { "id": 2, "title": "Feup Career Fair 2018", "description": "Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!", "start_date": "2018-10-15T23:00:00.000Z", "end_date": "2018-10-18T23:00:00.000Z", "location": "FEUP", "price": 0, "entity_id": 9, "user_id": 2, "is_favorite": true };
        const tree = renderer.create(<FavoriteEvent {...eventData} language='PT' />).getInstance();

        tree.ImageLoadingError();
        expect(tree.state.imageLoaded).toEqual(false);
    });


    it('favorite an event works', (done) => {

        const eventData = {
            "id": 2,
            "title": "Feup Career Fair 2018",
            "description": "Nos dias 16, 17, 18 e 19 de outubro acontece mais uma edição da FEUP CAREER FAIR e a FEUP convida todos os estudantes e graduados a estarem presentes!",
            "start_date": "2018-10-15T23:00:00.000Z",
            "end_date": "2018-10-18T23:00:00.000Z",
            "location": "FEUP",
            "price": 0,
            "entity_id": 9,
            "user_id": 2,
            "is_favorite": false
        };

        let mock = jest.fn();
        const wrapper = shallow(<FavoriteEvent {...eventData} onFavorite={mock} language='PT' />);

        wrapper.instance().onFavoriteCall();

        setImmediate(() => {
            expect(mock).toHaveBeenCalled();
            done();
        });
    });

});
