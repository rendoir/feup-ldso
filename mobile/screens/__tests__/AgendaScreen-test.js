/**  
* @jest-environment jsdom  
*/
import 'react-native';
import React from 'react';
import AgendaScreen from '../AgendaScreen';
import renderer from 'react-test-renderer';
import NavigationTestUtils from 'react-navigation/NavigationTestUtils';
import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import { shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

var mockAxios = new MockAdapter(axios);


describe('App snapshot', () => {
  jest.useFakeTimers();
  beforeEach(() => {
    NavigationTestUtils.resetInternalState();
  });

  it('renders correctly', async () => {
    const wrapper = shallow(<AgendaScreen />);
    expect(wrapper).toMatchSnapshot();
  });

  it('mounts correctly', () => {
    const tree = renderer.create(<AgendaScreen />).getInstance();
    setImmediate(() => {
      tree.componentWillMount();
      expect(tree.state.isCancelled).toEqual(false);
      expect(tree.state.loading).toEqual(false);
    });
  });

  it('unmounts correctly', () => {
    const tree = renderer.create(<AgendaScreen />).getInstance();
    setImmediate(() => {
      tree.componentWillUnmount();
      expect(tree.state.isCancelled).toEqual(true);
    });
  });

  it('renders list events', () => {
    mockAxios.onGet('http://localhost:3030/events?').reply(200, {
      count: 3,
      events: [{
        title: 'Title',
        description: 'description',
        start_date: '2018-10-27 11:11:00',
        end_date: '2018-10-28 11:11:00',
        initials: 'FEUP'
      },
      {
        title: 'Title',
        description: 'description',
        start_date: '2018-10-27 11:11:00',
        end_date: '2018-10-28 11:11:00',
        initials: 'FEUP'
      },
      {
        title: 'Title',
        description: 'description',
        start_date: '2018-10-27 11:11:00',
        end_date: '2018-10-28 11:11:00',
        initials: 'FEUP'
      }]
    });

    const events = renderer.create(
      <AgendaScreen
        loading={true}
        category={null}
        entity={null}
      />
    );
    let tree = events.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('check entity and category update', () => {
    const tree = renderer.create(<AgendaScreen />).getInstance();
    setImmediate(() => {
      tree.props.navigation.setParams({ selectedEntityId: '1', selectedCategoryId: '2' })
      expect(tree.state.entity).toEqual(1);
      expect(tree.state.category).toEqual(2);
    });
  });

});
