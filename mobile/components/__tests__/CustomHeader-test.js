import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import CustomHeader from '../CustomHeader';

it('renders correctly', () => {
    const tree = renderer.create(<CustomHeader/>).toJSON();

    expect(tree).toMatchSnapshot();
});