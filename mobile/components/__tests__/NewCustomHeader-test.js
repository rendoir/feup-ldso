/**
 * @jest-environment jsdom
 */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import NewCustomHeader from '../NewCustomHeader';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


describe('Custom Header', () => {

    it('renders correctly in portuguese', () => {
        const tree = renderer.create(<NewCustomHeader language='PT' />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders correctly in english', () => {
        const tree = renderer.create(<NewCustomHeader language='EN' />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('change language', () => {
        let toggleLanguage = jest.fn();
        const wrapper = shallow(<NewCustomHeader language='PT' toggleLanguage={toggleLanguage}/>);

        let button = wrapper.find('.change-language').first();
        button.props().onPress();

        expect(toggleLanguage).toHaveBeenCalled();
    });

    it('test go back', () => {
        const navigation = { getParam: jest.fn(), goBack: jest.fn() };
        const wrapper = shallow(<NewCustomHeader language='PT' navigation={navigation} />);

        let button = wrapper.find('.goBack').first();
        button.props().onPress();

        expect(navigation.goBack).toHaveBeenCalled();
    });

});
