import React from 'react';
import rendered from 'react-test-renderer';
import axios from 'axios';
import { mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import ListEvents from './ListEvents';

var mockAxios = new MockAdapter(axios);

describe("Check Render ListEvents", () => {
  it('renders list events', () => {
    mockAxios.onGet('http://localhost:3030/web/1').reply(200, {
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
    })

    const listEvents = rendered.create(
      <ListEvents
        toggleAddEventFormShowFlag={null}
        displayListEvents={true}
        showEventPage={false}
        refreshListEvents={false}
        updateRefreshEvents={false}
        categories={[]}
        entities={[]}
      />
    );
    let treeList = listEvents.toJSON();
    expect(treeList).toMatchSnapshot();
  });

  it('don\'t display list events', () => {
    mockAxios.onGet('http://localhost:3030/web/1').reply(200, {
      count: 3,
      events: [{
        title: 'Title',
        description: 'description',
        start_date: '2018-10-27 11:11:00',
        end_date: '2018-10-28 11:11:00',
        initials: 'FEUP'
      }]
    })

    const listEvents = rendered.create(
      <ListEvents
        toggleAddEventFormShowFlag={null}
        displayListEvents={false}
        showEventPage={false}
        refreshListEvents={false}
        updateRefreshEvents={false}
        categories={[]}
        entities={[]}
      />
    );
    let treeList = listEvents.toJSON();
    expect(treeList).toMatchSnapshot();
  });
})

describe("Handle Search Changes", () => {

  it('Check state on search text input change', () => {

    const wrapper = mount(<ListEvents
      toggleAddEventFormShowFlag={null}
      displayListEvents={false}
      showEventPage={false}
      refreshListEvents={false}
      updateRefreshEvents={false}
      categories={[]}
      entities={[]}
    />
    );

    const input = wrapper.find('input#search-text-input.form-control').first();

    input.simulate('change', {
      target: { value: 'Search' }
    })

    expect(
      wrapper.state().searchInput
    ).toEqual('Search')

  });

});


describe("Check Pagination", () => {

  it("Check if pagination fills events", () => {

    const events = [{
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
    }];

    mockAxios.onGet('http://localhost:3030/web/1').reply(200, {
      count: 7,
      events: events
    })

    const wrapper = mount(<ListEvents
      toggleAddEventFormShowFlag={null}
      displayListEvents={false}
      showEventPage={false}
      refreshListEvents={false}
      updateRefreshEvents={false}
      categories={[]}
      entities={[]}
    />
    );

    const input = wrapper.find('div.pagination a.item[type="nextItem"]').first();
    input.simulate('click');

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.state().events).toEqual(events);
    })
  });

  it("Check if pagination doens't fill events", () => {

    mockAxios.onGet('http://localhost:3030/web/1').reply(400, {});

    const wrapper = mount(<ListEvents
      toggleAddEventFormShowFlag={null}
      displayListEvents={false}
      showEventPage={false}
      refreshListEvents={false}
      updateRefreshEvents={false}
      categories={[]}
      entities={[]}
    />
    );

    const input = wrapper.find('div.pagination a.item[type="nextItem"]').first();
    input.simulate('click');

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.state().alertType).toEqual("danger");
      expect(wrapper.state().alertMessage).toEqual("Ocorreu um erro. Não foi possível mostrar os eventos.");
    })

  })

});


describe("Check componentDidMount actions", () => {
  
  it("Change refesh events flag", () => {
    const events = [{
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
    }];

    mockAxios.onGet('http://localhost:3030/web/1').reply(200, {
      count: 7,
      events: events
    })

    const wrapper = mount(<ListEvents
      toggleAddEventFormShowFlag={null}
      displayListEvents={false}
      showEventPage={false}
      refreshListEvents={false}
      updateRefreshEvents={jest.fn()}
      categories={[]}
      entities={[]}
    />
    );

    wrapper.setProps({
      refreshListEvents: true
    })

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.state().events).toEqual(events);
    })
  });

  it("Change refesh events flag - ERROR", () => {
    mockAxios.onGet('http://localhost:3030/web/1').reply(400, {});

    const wrapper = mount(<ListEvents
      toggleAddEventFormShowFlag={null}
      displayListEvents={false}
      showEventPage={false}
      refreshListEvents={false}
      updateRefreshEvents={jest.fn()}
      categories={[]}
      entities={[]}
    />
    );

    wrapper.setProps({
      refreshListEvents: true
    })

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.state().alertType).toEqual("danger");
      expect(wrapper.state().alertMessage).toEqual("Ocorreu um erro. Não foi possível mostrar os eventos.");
    })
  });

})