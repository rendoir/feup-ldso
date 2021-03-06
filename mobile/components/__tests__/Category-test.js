import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Category from '../Category';


describe('Category', () => {

    it('renders correctly', () => {
        const categoryData = {"id": 2, "name": "Literatura", "description": "Literatura"};
        const tree = renderer.create(<Category data={categoryData} language='PT' />).toJSON();

        expect(tree).toMatchSnapshot();
    });

    it('renders correctly in english', () => {
        const categoryData = {"id": 2, "name": "Literatura", "name_english": "Literature", "description": "Literatura"};
        const tree = renderer.create(<Category data={categoryData} language='EN' />).toJSON();

        expect(tree).toMatchSnapshot();
    });

});
