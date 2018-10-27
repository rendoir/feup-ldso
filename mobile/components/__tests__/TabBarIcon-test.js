import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import TabBarIcon from '../TabBarIcon';

it('renders correctly', () => {
    iconData = {"name":"Icon"};
    const tree = renderer.create(<TabBarIcon data={iconData}/>).toJSON();

    expect(tree).toMatchSnapshot();
});