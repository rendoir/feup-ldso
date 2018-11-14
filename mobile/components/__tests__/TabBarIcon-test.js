import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import TabBarIcon from '../TabBarIcon';

it('renders correctly focused', () => {
    const iconData = {"name": "Icon"};
    const tree = renderer.create(<TabBarIcon data={iconData} focused={true}/>).toJSON();
    expect(tree).toMatchSnapshot();
});

it('renders correctly unfocused', () => {
    const iconData = {"name": "Icon"};
    const tree = renderer.create(<TabBarIcon data={iconData} focused={false}/>).toJSON();

    expect(tree).toMatchSnapshot();
});
