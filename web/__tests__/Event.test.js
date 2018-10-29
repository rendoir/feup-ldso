import React from 'react';
import rendered from 'react-test-renderer';
import Event from '../src/Event';
import { mount } from 'enzyme';
import sinon from 'sinon';
import axios from 'axios';
import swal from 'sweetalert';
import MockAdapter from 'axios-mock-adapter';

var mockAxios = new MockAdapter(axios);

describe("render event", () => {

  it('renders event', () => {
    const event = rendered.create(<Event
      key={0}
      info={
        {
          id: 1,
          title: 'Title',
          description: 'description',
          start_date: '2018-10-27 11:11:00',
          end_date: '2018-10-28 11:11:00',
          initials: 'FEUP'
        }
      }
      deleteEventFromArray={null}
      updateAlertMessage={null}
    />);
    let treeList = event.toJSON();
    expect(treeList).toMatchSnapshot();
  });

});

describe("Delete Event", () => {

  it("Check if swal appears when delete button is clicked", () => {

    let spy = sinon.spy(swal);

    const wrapper = mount(<Event
      key={0}
      info={
        {
          id: 1,
          title: 'Title',
          description: 'description',
          start_date: '2018-10-27 11:11:00',
          end_date: '2018-10-28 11:11:00',
          initials: 'FEUP'
        }
      }
      deleteEventFromArray={null}
      updateAlertMessage={null}
    />
    );

    const button = wrapper.find('div.event-buttons button.delete-button').first();
    button.simulate('click');

    expect(spy.calledOnce);


  });

  it("Check if deletion was successfull", () => {

    let props = {
      key: 0,
      info: {
        id: 1,
        title: 'Title',
        description: 'description',
        start_date: '2018-10-27 11:11:00',
        end_date: '2018-10-28 11:11:00',
        initials: 'FEUP'
      },
      deleteEventFromArray: jest.fn(),
      updateAlertMessage: null
    }
    
    mockAxios.onDelete('http://localhost:3030/').reply(200);

    const wrapper = mount(<Event {...props}/>);

    wrapper.instance().deleteEventRequest();

    setImmediate(() => {
      expect(props.deleteEventFromArray).toHaveBeenCalledWith(1);
    })

  });

  it("Check if deletion wasn't successfull", () => {

    let props = {
      key: 0,
      info: {
        title: 'Title',
        description: 'description',
        start_date: '2018-10-27 11:11:00',
        end_date: '2018-10-28 11:11:00',
        initials: 'FEUP'
      },
      deleteEventFromArray: jest.fn(),
      updateAlertMessage: jest.fn()
    }
    
    mockAxios.onDelete('http://localhost:3030/').reply(400);

    const wrapper = mount(<Event {...props}/>);

    wrapper.instance().deleteEventRequest();

    setImmediate(() => {
      wrapper.update();

      expect(props.updateAlertMessage).toHaveBeenCalledTimes(1);

    })


  });

})