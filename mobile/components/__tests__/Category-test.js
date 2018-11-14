import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Category from '../Category';

it('renders correctly', () => {
    const categoryData = {"id": 2, "name": "Literatura", "description": "Literatura"};
    const tree = renderer.create(<Category data={categoryData}/>).toJSON();

    expect(tree).toMatchSnapshot();
});
