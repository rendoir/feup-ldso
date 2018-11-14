import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import Entity from '../Entity';

it('renders correctly', () => {
    const entityData = {"id": 2, "initials": "FEUP"};
    const tree = renderer.create(<Entity data={entityData}/>).toJSON();

    expect(tree).toMatchSnapshot();
});
