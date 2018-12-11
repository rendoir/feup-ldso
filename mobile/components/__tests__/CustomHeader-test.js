/**
 * @jest-environment jsdom
 */
import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import CustomHeader from '../CustomHeader';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


describe('Custom Header', () => {

    it('renders correctly in portuguese', () => {
        const tree = renderer.create(<CustomHeader language='PT' />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders correctly in english', () => {
        const tree = renderer.create(<CustomHeader language='EN' />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('change language', () => {
        let toggleLanguage = jest.fn();
        const wrapper = shallow(<CustomHeader language='PT' toggleLanguage={toggleLanguage}/>);

        let button = wrapper.find('.change-language').first();
        button.props().onPress();

        expect(toggleLanguage).toHaveBeenCalled();
    });

});
