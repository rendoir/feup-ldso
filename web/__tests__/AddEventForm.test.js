import React from 'react';
import rendered from 'react-test-renderer';
import AddEventForm from '../src/AddEventForm';
import { mount } from 'enzyme';
import sinon from 'sinon';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

var mockAxios = new MockAdapter(axios);

describe("AddEventForm Render", () => {

  it('renders form with one entity', () => {

    const form = rendered.create(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }]}
    />);

    let tree = form.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders form with two entities', () => {
    const form = rendered.create(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test' }]}
    />);

    let tree = form.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('don\'t display form', () => {
    const form = rendered.create(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={false}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test' }]}
    />);

    let tree = form.toJSON();
    expect(tree).toMatchSnapshot();
  });

});

describe("AddEventForm Inputs Change", () => {

  it('Check state on title input change', () => {

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test' }]} />
    );

    const input = wrapper.find('input#form-title.form-control').first();

    input.simulate('change', {
      target: { value: 'Title' }
    })

    expect(
      wrapper.state().title
    ).toEqual('Title')

  });

  it('Check state on description input change', () => {

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test' }]} />
    );

    const input = wrapper.find('textarea#form-descriptionAndImage.form-control').first();

    input.simulate('change', {
      target: { value: 'Description' }
    })

    expect(
      wrapper.state().description
    ).toEqual('Description')

  });

  it('Check state on image input change', () => {

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test' }]} />
    );

    global.URL.createObjectURL = jest.fn();

    const input = wrapper.find('input#form-image.form-control-file').first();
    const image = "data:image/png;base64,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"

    input.simulate('change', {
      target: { files: [image] }
    })

    expect(
      wrapper.state().image 
    ).toEqual(image)

  });

  it('Check state on start date input change', () => {

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test' }]} />
    );

    const input = wrapper.find('input#form-date-start.form-control').first();
    let date = new Date();
    date = new Date(date.getDay() + 1);

    input.simulate('change', {
      target: { value: date.toISOString() }
    })

    expect(
      wrapper.state().startDate
    ).toEqual(date.toISOString())

  });

  it('Check state on end date input change', () => {

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test' }]} />
    );

    const input = wrapper.find('input#form-date-end.form-control').first();
    let date = new Date();
    date = new Date(date.getDay() + 2);

    input.simulate('change', {
      target: { value: date.toISOString() }
    })

    expect(
      wrapper.state().endDate
    ).toEqual(date.toISOString())

  });

  it('Check state on location input change', () => {

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test' }]} />
    );

    const input = wrapper.find('input#form-location.form-control').first();

    input.simulate('change', {
      target: { value: 'FEUP, Porto' }
    })

    expect(
      wrapper.state().location
    ).toEqual('FEUP, Porto')

  });

  it('Check state on price input change', () => {

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test' }]} />
    );

    const input = wrapper.find('input[type="number"]').first();

    input.simulate('change', {
      target: { value: 10 }
    })

    expect(
      wrapper.state().price
    ).toEqual(10)

  });

  it('Check state of show add event form flag', () => {

    let spy = sinon.spy(AddEventForm.prototype, 'callToggleAddEventFormShowFlag');
    let mock = jest.fn((value) => { });

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={mock}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test' }]} />
    );
    
    const input = wrapper.find('button.btn.btn-secondary').first();

    input.simulate('click');
    expect(spy.calledOnce);

  });

  it('Check state on choosing entity - success', () => {

    let element = document.createElement('div');
    element.innerHTML= 'Test';
    document.querySelector = jest.fn().mockReturnValue(element)

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test2' }]} />
    );

    const div = wrapper.find('#add-event-entity div.item').first();
    div.simulate('click');

    expect(
      wrapper.state().chosenEntity
    ).toEqual(1);

  });

  it('Check state on choosing entity - no entity found', () => {

    let element = document.createElement('div');
    element.innerHTML= 'No Test';
    document.querySelector = jest.fn().mockReturnValue(element)

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test2' }]} />
    );

    const div = wrapper.find('#add-event-entity div.item').first();
    div.simulate('click');

    expect(
      wrapper.state().chosenEntity
    ).toEqual(null);

  });

})


describe("Check Add Event Form Requests", () => {

  it('Check axios request POST - Success', () => {

    let element = document.createElement('a');
    element.setAttribute("value", "1");
    document.querySelectorAll = jest.fn().mockReturnValue([element])

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[{ key: 0, value: 1, text: 'Category 1' }]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test2' }]} />
    );

    let date = new Date();
    let startDate = new Date(date.getDay() + 1).toISOString();
    let endDate = new Date(date.getDay() + 2).toISOString();
    wrapper.setState({
      title: 'Title',
      description: 'description',
      startDate: startDate,
      endDate: endDate,
      location: 'FEUP, Porto',
      price: 0,
      chosenEntity: 1,
      eventAdded: false
    })

    mockAxios.onPost().reply(200);

    const button = wrapper.find('div.buttons_style.form-group button.btn.btn-primary').first();
    button.simulate('submit');

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.state().eventAdded).toEqual(true);
      expect(wrapper.state().alertType).toEqual("success");
      expect(wrapper.state().alertMessage).toEqual("O evento foi adicionado!");
    })    

  });

  it('Check axios request POST - Error', () => {

    let element = document.createElement('a');
    element.setAttribute("value", "1");
    document.querySelectorAll = jest.fn().mockReturnValue([element])

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[{ key: 0, value: 1, text: 'Category 1' }]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test2' }]} />
    );

    let date = new Date();
    let startDate = new Date(date.getDay() + 1).toISOString();
    let endDate = new Date(date.getDay() + 2).toISOString();
    wrapper.setState({
      title: 'Title',
      description: 'description',
      startDate: startDate,
      endDate: endDate,
      location: 'FEUP, Porto',
      price: 0,
      chosenEntity: 1,
      eventAdded: false
    })

    mockAxios.onPost().reply(400);

    const button = wrapper.find('div.buttons_style.form-group button.btn.btn-primary').first();
    button.simulate('submit');

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.state().eventAdded).toEqual(false);
      expect(wrapper.state().alertType).toEqual("danger");
      expect(wrapper.state().alertMessage).toEqual("Ocorreu um erro. O evento não foi adicionado.");
    })      

  });

  it('Check no entity chosen', () => {

    let element = document.createElement('a');
    element.setAttribute("value", "1");
    document.querySelectorAll = jest.fn().mockReturnValue([element])

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[{ key: 0, value: 1, text: 'Category 1' }]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test2' }]} />
    );

    let date = new Date();
    let startDate = new Date(date.getDay() + 1).toISOString();
    let endDate = new Date(date.getDay() + 2).toISOString();
    wrapper.setState({
      title: 'Title',
      description: 'description',
      startDate: startDate,
      endDate: endDate,
      location: 'FEUP, Porto',
      price: 0,
      chosenEntity: null,
      eventAdded: false
    })

    mockAxios.onPost().reply(400);

    const button = wrapper.find('div.buttons_style.form-group button.btn.btn-primary').first();
    button.simulate('submit');

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.state().eventAdded).toEqual(false);
      expect(wrapper.state().alertType).toEqual("danger");
      expect(wrapper.state().alertMessage).toEqual("Escolha uma entidade, por favor.");
    })      

  });

  it('Check no categories chosen', () => {

    let element = document.createElement('a');
    element.setAttribute("value", "1");
    document.querySelectorAll = jest.fn().mockReturnValue([])

    const wrapper = mount(<AddEventForm
      toggleAddEventFormShowFlag={null}
      displayForm={true}
      categories={[{ key: 0, value: 1, text: 'Category 1' }]}
      entities={[{ key: 0, value: 1, text: 'Test' }, { key: 1, value: 2, text: 'Test2' }]} />
    );

    let date = new Date();
    let startDate = new Date(date.getDay() + 1).toISOString();
    let endDate = new Date(date.getDay() + 2).toISOString();
    wrapper.setState({
      title: 'Title',
      description: 'description',
      startDate: startDate,
      endDate: endDate,
      location: 'FEUP, Porto',
      price: 0,
      chosenEntity: 1,
      eventAdded: false
    })

    const button = wrapper.find('div.buttons_style.form-group button.btn.btn-primary').first();
    button.simulate('submit');

    setImmediate(() => {
      wrapper.update();
      expect(wrapper.state().eventAdded).toEqual(false);
      expect(wrapper.state().alertType).toEqual("danger");
      expect(wrapper.state().alertMessage).toEqual("Não é possível criar um evento sem categorias.");
    })      

  });

})
