import 'react-native';
import React from 'react';
import SearchScreen from '../SearchScreen';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';

describe('App snapshot', () => {
    jest.useFakeTimers();
    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
    });

    it('renders correctly', async() => {
        const tree = renderer.create(<SearchScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
