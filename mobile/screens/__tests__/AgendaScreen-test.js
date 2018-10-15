import 'react-native';
import React from 'react';
import AgendaScreen from '../AgendaScreen';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';

describe('App snapshot', () => {
  jest.useFakeTimers();
  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it('renders the loading screen', async () => {
    const tree = renderer.create(<AgendaScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
