import React from 'react';
import rendered from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import ListEvents from '../src/ListEvents';


var mockAxios = new MockAdapter(axios);
document.cookie = "access_token=123";

describe("Check Render ListEvents", () => {
    it('renders list events', () => {
        mockAxios.onGet().reply(200, {
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

        const listEvents = rendered.create(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={false}
                    categories={[]}
                    entities={[]}
                />
            </BrowserRouter>
        );
        let treeList = listEvents.toJSON();
        expect(treeList).toMatchSnapshot();
    });

    it('don\'t display list events', () => {
        mockAxios.onGet().reply(200, {
            count: 3,
            events: [{
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP'
            }]
        });

        const listEvents = rendered.create(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={false}
                    categories={[]}
                    entities={[]}
                />
            </BrowserRouter>
        );
        let treeList = listEvents.toJSON();
        expect(treeList).toMatchSnapshot();
    });
});

describe("Handle Search Changes", () => {

    it('Check state on search text input change', () => {

        const wrapper = mount(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={false}
                    categories={[]}
                    entities={[]}
                />
            </BrowserRouter>
        );

        let wrapperList = wrapper.find(ListEvents).first();
        const input = wrapper.find('input#search-text-input.form-control').first();

        input.simulate('change', {
            target: { value: 'Search' }
        });

        expect(
            wrapperList.state().searchInput
        ).toEqual('Search');

    });

});


describe("Check Pagination", () => {

    it("Check if pagination fills events", (done) => {

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

        mockAxios.onGet().reply(200, {
            count: 7,
            events: events
        });

        const wrapper = mount(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={false}
                    categories={[]}
                    entities={[]}
                />
            </BrowserRouter>
        );

        let wrapperList = wrapper.find(ListEvents).first();

        const input = wrapperList.find('div.pagination a.item[type="nextItem"]').first();
        input.simulate('click');


        setImmediate(() => {
            wrapperList.update();
            expect(wrapperList.state().events).toEqual(events);
            done();
        });
    });

    it("Check if pagination doens't fill events", (done) => {

        mockAxios.onGet().reply(400, {});

        const wrapper = mount(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={false}
                    categories={[]}
                    entities={[]}
                />
            </BrowserRouter>
        );

        let wrapperList = wrapper.find(ListEvents).first();

        const input = wrapperList.find('div.pagination a.item[type="nextItem"]').first();
        input.simulate('click');

        setImmediate(() => {
            wrapperList.update();
            expect(wrapperList.state().alertType).toEqual("danger");
            expect(wrapperList.state().alertMessage).toEqual("Ocorreu um erro. Não foi possível mostrar os eventos.");
            done();
        });

    });

});

describe("Check componentDidMount actions", () => {

    it("Change refesh events flag", async() => {
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

        mockAxios.onGet().reply(200, {
            count: 7,
            events: events
        });

        const wrapper = mount(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={jest.fn()}
                    categories={[]}
                    entities={[]}
                />
            </BrowserRouter>
        );

        let wrapperList = wrapper.find(ListEvents).first();

        wrapper.setProps({
            children: React.cloneElement(wrapper.props().children, { refreshListEvents: true })
        });

        setImmediate(() => {
            wrapperList.update();
            expect(wrapperList.state().events).toEqual(events);
        });
    });

    it("Change refesh events flag - ERROR", async() => {
        mockAxios.onGet().reply(400, {});

        const wrapper = mount(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={jest.fn()}
                    categories={[]}
                    entities={[]}
                />
            </BrowserRouter>
        );

        let wrapperList = await wrapper.find(ListEvents).first();

        await wrapper.setProps({
            children: React.cloneElement(await wrapper.props().children, { refreshListEvents: true })
        });

        await wrapperList.update();

        setImmediate(() => {
            expect(wrapperList.state().alertType).toEqual("danger");
            expect(wrapperList.state().alertMessage).toEqual("Ocorreu um erro. Não foi possível mostrar os eventos.");
        });
    });
});

describe("Check deletion methods", () => {

    it("Check updateAlertMessage", async() => {

        const wrapper = await mount(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={jest.fn()}
                    categories={[]}
                    entities={[]}
                />
            </BrowserRouter>
        );

        let wrapperList = await wrapper.find(ListEvents).first();

        wrapperList.instance().updateAlertMessage('danger', 'Test Alert Message');

        await wrapperList.update();
        expect(wrapperList.state().alertType).toEqual('danger');
        expect(wrapperList.state().alertMessage).toEqual('Test Alert Message');


    });

    it("Check deleteEventFromArray - Success", async() => {

        const wrapper = mount(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={jest.fn()}
                    categories={[]}
                    entities={[]}
                />
            </BrowserRouter>
        );

        let wrapperList = wrapper.find(ListEvents).first();

        wrapperList.setState({
            events: [{
                id: 1,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP'
            },
            {
                id: 2,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP'
            }]
        });

        await wrapperList.update();
        expect(wrapperList.state().events.length).toEqual(2);
        wrapperList.instance().deleteEventFromArray(1);

        await wrapperList.update();
        expect(wrapperList.state().events.length).toBe(1);
        expect(wrapperList.state().alertType).toEqual('success');
        expect(wrapperList.state().alertMessage).toEqual('O evento foi apagado com sucesso.');

    });

    it("Check deleteEventFromArray - Error", async() => {

        const wrapper = mount(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={jest.fn()}
                    categories={[]}
                    entities={[]}
                />
            </BrowserRouter>
        );

        let wrapperList = wrapper.find(ListEvents).first();

        wrapperList.setState({
            events: [{
                id: 1,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP'
            },
            {
                id: 2,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                initials: 'FEUP'
            }]
        });

        await wrapperList.update();
        expect(wrapperList.state().events.length).toEqual(2);
        wrapperList.instance().deleteEventFromArray(-1);

        await wrapperList.update();
        expect(wrapperList.state().events.length).toBe(2);
        expect(wrapperList.state().alertType).toEqual('danger');
        expect(wrapperList.state().alertMessage).toEqual('Ocorreu um erro. Por favor tente atualizar a página.');

    });
});
