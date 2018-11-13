/**
 * @jest-environment jsdom
 */

import 'react-native';
import React from 'react';
import App from '../App';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import { shallow, mount } from 'enzyme';
import LogInScreen from '../screens/LogInScreen';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
const { Google } = require('expo');

Enzyme.configure({ adapter: new Adapter() });

var mockAxios = new MockAdapter(axios);

describe('App snapshot', () => {
  jest.useFakeTimers();
  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it('renders the loading screen', async () => {
    const tree = renderer.create(<App />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders the root without loading screen', async () => {
    const tree = renderer.create(<App skipLoadingScreen />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('log in success', async () => {
    mockAxios.onPost().reply(200, {accessToken: "abc", userId: 1});

    jest.mock('expo', () => ({
      SecureStore: {
        setItemAsync: jest.fn()
      }
    }))

    const wrapper = shallow(<App skipLoadingScreen />);
    wrapper.instance().handleLogIn();

    setImmediate(() => {
      expect(wrapper.state().signedIn).toEqual(true);
    })
  });

  it('log in fail', async () => {
    mockAxios.onPost().reply(400);

    jest.mock('expo', () => ({
      SecureStore: {
        setItemAsync: jest.fn()
      }
    }))

    const wrapper = shallow(<App skipLoadingScreen />);
    wrapper.instance().handleLogIn();

    setImmediate(() => {
      expect(wrapper.state().signedIn).toEqual(false);
    })
  });
});
