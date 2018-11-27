import React from 'react';
import rendered from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import EventPage from '../src/EventPage';
import { mount } from 'enzyme';
import sinon from 'sinon';
import axios from 'axios';
import swal from 'sweetalert';
import MockAdapter from 'axios-mock-adapter';

var mockAxios = new MockAdapter(axios);
var props = {
    match: {
        params: {
            id: 1
        }
    }
};

describe("Render", () => {

    it('renders event page', () => {

        mockAxios.onGet().reply(200, {
            id: 1,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10,
            entity: {
                id: 1,
                name: 'Faculdade de Engenharia da Universidade do Porto',
                initials: 'FEUP',
                description: 'description',
                color: '#ffffff',
                color2: '#ffffff',
                location: 'Porto'
            },
            categories: [
                {
                    id: 1,
                    name: 'Category1',
                    description: 'Description'
                },
                {
                    id: 2,
                    name: 'Category2',
                    description: 'Description'
                }
            ]
        });


        const event = rendered.create(
            <BrowserRouter>
                <EventPage {...props} />
            </BrowserRouter>);
        let treeList = event.toJSON();
        expect(treeList).toMatchSnapshot();
    });

});


describe("Check ComponentDidMount", () => {

    it("/GET page info - Success", async(done) => {

        mockAxios.onGet().reply(200, {
            id: 1,
            title: 'Title',
            description: 'description',
            start_date: '2019-01-27 11:11:00',
            end_date: '2019-01-28 11:11:00',
            entity_id: 1,
            location: 'Porto',
            price: 10,
            entity: {
                id: 1,
                name: 'Faculdade de Engenharia da Universidade do Porto',
                initials: 'FEUP',
                description: 'description',
                color: '#ffffff',
                color2: '#ffffff',
                location: 'Porto'
            },
            categories: [
                {
                    id: 1,
                    name: 'Category1',
                    description: 'Description'
                },
                {
                    id: 2,
                    name: 'Category2',
                    description: 'Description'
                }
            ]
        });

        let wrapper = await mount(
            <BrowserRouter>
                <EventPage {...props} />
            </BrowserRouter>
        );

        let wrapperPage = await wrapper.find(EventPage).first();

        await wrapperPage.update();


        setImmediate(() => {
            expect(wrapperPage.state().id).toEqual(1);
            expect(wrapperPage.state().title).toEqual('Title');
            expect(wrapperPage.state().description).toEqual('description');
            expect(wrapperPage.state().start_date).toEqual('27/01/2019 11:11');
            expect(wrapperPage.state().end_date).toEqual('28/01/2019 11:11');
            expect(wrapperPage.state().entity_id).toEqual(1);
            expect(wrapperPage.state().location).toEqual('Porto');
            expect(wrapperPage.state().price).toEqual(10);
            expect(wrapperPage.state().entity).toEqual({
                id: 1,
                name: 'Faculdade de Engenharia da Universidade do Porto',
                initials: 'FEUP',
                description: 'description',
                color: '#ffffff',
                color2: '#ffffff',
                location: 'Porto'
            });
            expect(wrapperPage.state().categories.length).toEqual(2);
            done();
        });

    });

    it("/GET page info - Doens't exist", async(done) => {

        mockAxios.onGet().reply(200, {});

        let wrapper = await mount(
            <BrowserRouter>
                <EventPage {...props} />
            </BrowserRouter>
        );

        let wrapperPage = await wrapper.find(EventPage).first();

        await wrapperPage.update();


        setImmediate(() => {
            expect(wrapperPage.state().alertType).toEqual("danger");
            expect(wrapperPage.state().alertMessage).toEqual("Este evento não existe.");
            done();
        });

    });

    it("/GET page info - Error", async(done) => {

        mockAxios.onGet().reply(400);

        let wrapper = await mount(
            <BrowserRouter>
                <EventPage {...props} />
            </BrowserRouter>
        );

        let wrapperPage = await wrapper.find(EventPage).first();

        await wrapperPage.update();

        setImmediate(() => {
            expect(wrapperPage.state().alertType).toEqual('danger');
            expect(wrapperPage.state().alertMessage).toEqual('Ocorreu um erro. Por favor tente novamente.');
            done();
        });

    });

});

describe("Delete Event", () => {

    it("Check if swal appears when delete button is clicked", async() => {

        mockAxios.onGet().reply(200, {
            id: 1,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity_id: 1,
            location: 'Porto',
            price: 10,
            entity: {
                id: 1,
                name: 'Faculdade de Engenharia da Universidade do Porto',
                initials: 'FEUP',
                description: 'description',
                color: '#ffffff',
                color2: '#ffffff',
                location: 'Porto'
            },
            categories: [
                {
                    id: 1,
                    name: 'Category1',
                    description: 'Description'
                },
                {
                    id: 2,
                    name: 'Category2',
                    description: 'Description'
                }
            ]
        });

        let spy = sinon.spy(swal);

        const wrapper = await mount(
            <BrowserRouter>
                <EventPage {...props} />
            </BrowserRouter>
        );


        let wrapperPage = await wrapper.find(EventPage).first();

        await wrapperPage.instance().forceUpdate();
        await wrapperPage.update();

        const button = await wrapperPage.update().find('button.delete-button').first();
        button.simulate('click');

        expect(spy.calledOnce);


    });

    it("Check if deletion was successfull", async(done) => {

        let state = {
            id: 1,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity_id: 1,
            location: 'Porto',
            price: 10,
            entity: {
                id: 1,
                name: 'Faculdade de Engenharia da Universidade do Porto',
                initials: 'FEUP',
                description: 'description',
                color: '#ffffff',
                color2: '#ffffff',
                location: 'Porto'
            },
            categories: [
                {
                    id: 1,
                    name: 'Category1',
                    description: 'Description'
                },
                {
                    id: 2,
                    name: 'Category2',
                    description: 'Description'
                }
            ],
            alertType: null,
            alertMessage: null,
            redirect: false,
            errorLoadingImage: true
        };

        mockAxios.onDelete().reply(200);

        const wrapper = await mount(
            <BrowserRouter>
                <EventPage {...props} />
            </BrowserRouter>);

        let wrapperPage = await wrapper.find(EventPage).first();

        await wrapperPage.setState(state);
        await wrapperPage.update();

        await wrapperPage.instance().deleteEventConfirmed();

        setImmediate(() => {
            expect(wrapperPage.state().redirect).toEqual(true);
            done();
        });


    });

    it("Check if deletion wasn't successfull", async(done) => {

        mockAxios.onDelete().reply(400);

        const wrapper = await mount(
            <BrowserRouter>
                <EventPage {...props} />
            </BrowserRouter>);

        let wrapperPage = await wrapper.find(EventPage).first();

        await wrapperPage.instance().deleteEventConfirmed();

        await wrapperPage.update();

        setImmediate(() => {
            expect(wrapperPage.state().alertType).toEqual("danger");
            expect(wrapperPage.state().alertMessage).toEqual("Um erro ocorreu a apagar o evento. Tente mais tarde.");
            done();
        });
    });

});

describe("Get Image", () => {

    it("/GET Event Image - Error", async(done) => {

        mockAxios.onGet().reply(400);

        let wrapper = await mount(
            <BrowserRouter>
                <EventPage {...props} />
            </BrowserRouter>
        );

        let wrapperPage = await wrapper.find(EventPage).first();

        wrapperPage.instance().getDefaultImage = jest.fn();
        let spy = sinon.spy(wrapperPage.instance().getDefaultImage);

        await wrapperPage.update();

        setImmediate(() => {
            expect(spy.calledOnce);
            done();
        });

    });

    it("/GET Event Image - Check getDefaultImage", async(done) => {

        let wrapper = await mount(
            <BrowserRouter>
                <EventPage {...props} />
            </BrowserRouter>
        );

        let wrapperPage = await wrapper.find(EventPage).first();

        wrapperPage.setState({ errorLoadingImage: true });

        let element = document.createElement('img');
        element.src = '';
        document.querySelector = jest.fn().mockReturnValue(element);

        wrapperPage.instance().getDefaultImage();

        await wrapperPage.update();

        setImmediate(() => {
            expect(wrapperPage.state().errorLoadingImage).toEqual(false);
            done();
        });

    });

});
