import 'react-native';
import React from 'react';
import FavoritesScreen from '../FavoritesScreen';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';

describe('App snapshot', () => {
    jest.useFakeTimers();
    beforeEach(() => {
        NavigationTestUtils.resetInternalState();
    });

    it('renders correctly', async() => {
        const mockFn = jest.fn('didFocusSubscription');
        let i = 0;
        if (i == 1)
            mockFn();
        const tree = renderer.create(<FavoritesScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
