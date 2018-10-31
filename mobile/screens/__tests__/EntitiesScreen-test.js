import 'react-native';
import React from 'react';
import EntitiesScreen from '../EntitiesScreen';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';

describe('App snapshot', () => {
  jest.useFakeTimers();
  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it('renders correctly', async () => {
    const tree = renderer.create(<EntitiesScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
