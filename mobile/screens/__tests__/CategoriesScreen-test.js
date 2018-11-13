/**
 * @jest-environment jsdom
 */
import 'react-native';
import React from 'react';
import CategoriesScreen from '../CategoriesScreen';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
Enzyme.configure({ adapter: new Adapter() });

var mockAxios = new MockAdapter(axios);

describe('App snapshot', () => {
  jest.useFakeTimers();
  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it('renders correctly', async () => {
    const tree = renderer.create(<CategoriesScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
