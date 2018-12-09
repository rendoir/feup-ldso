import React from 'react';
import rendered from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { mount } from 'enzyme';
import MockAdapter from 'axios-mock-adapter';
import ListEvents from '../src/ListEvents';


var mockAxios = new MockAdapter(axios);
document.cookie = "access_token=123";

const globalEvents = {
    count: 3,
    rows:
        [{
            id: 1,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
        },
        {
            id: 2,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
        },
        {
            id: 3,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
        }]
};

describe("Check Render ListEvents", () => {
    it('renders list events', () => {
        mockAxios.onGet().reply(200, {
            count: 3,
            events: [{
                id: 1,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                entity: {
                    initials: 'FEUP'
                }
            },
            {
                id: 2,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                entity: {
                    initials: 'FEUP'
                }
            },
            {
                id: 3,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                entity: {
                    initials: 'FEUP'
                }
            }]
        });

        const listEvents = rendered.create(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={jest.fn()}
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
                entity: {
                    initials: 'FEUP'
                }
            }]
        });

        const listEvents = rendered.create(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={jest.fn()}
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
        mockAxios.onGet().reply(200, globalEvents);

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
            id: 1,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
        },
        {
            id: 2,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
        }];

        mockAxios.onGet().reply(200, {
            count: 7,
            rows: events
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

        const input = wrapperList.find('div.pagination a.item[type="nextItem"]').first();
        input.simulate('click');

        setImmediate(() => {
            wrapperList.update();
            expect(wrapperList.state().events).toEqual(events);
            done();
        });
    });

    it("Check if pagination fills events - searching", (done) => {

        const events = [{
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
        }];

        mockAxios.onGet().reply(200, {
            count: 7,
            rows: events
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
        wrapperList.setState({
            searching: true,
            fixedSearchText: "Title"
        });

        const input = wrapperList.find('div.pagination a.item[type="nextItem"]').first();
        input.simulate('click');

        setImmediate(() => {
            wrapperList.update();
            expect(wrapperList.state().events).toEqual(events);
            done();
        });
    });

    it("Check if pagination doesn't fill events", (done) => {

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

    it("Check if pagination doesn't fill events - searching", (done) => {

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

        let wrapperList = wrapper.find(ListEvents).first();
        wrapperList.setState({
            searching: true
        });

        const input = wrapperList.find('div.pagination a.item[type="nextItem"]').first();
        input.simulate('click');

        setImmediate(() => {
            wrapperList.update();
            expect(wrapperList.state().alertType).toEqual("danger");
            expect(wrapperList.state().alertMessage).toEqual("Ocorreu um erro. Não foi possível efetuar a pesquisa.");
            done();
        });

    });

});

describe("Check componentDidUpdate actions", () => {

    it("Change refesh events flag", () => {
        const events = [{
            id: 1,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
        },
        {
            id: 2,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
        }];

        mockAxios.onGet().reply(200, {
            count: 7,
            rows: events
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


    it("Change refesh events flag - ERROR", () => {
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

        let wrapperList = wrapper.find(ListEvents).first();

        wrapper.setProps({
            children: React.cloneElement(wrapper.props().children, { refreshListEvents: true })
        });

        setImmediate(() => {
            wrapperList.update();
            expect(wrapperList.state().alertType).toEqual("danger");
            expect(wrapperList.state().alertMessage).toEqual("Ocorreu um erro. Não foi possível mostrar os eventos.");
        });
    });
});


describe('Search Events by Text', () => {

    it('Search for events by text', () => {

        const events = [{
            id: 1,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
        },
        {
            id: 2,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
        }];

        mockAxios.onGet().reply(200, {
            count: 7,
            rows: events
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
        wrapperList.setState({
            searchInput: "Title"
        });

        let searchButton = wrapperList.find(".btn-search").first();
        searchButton.simulate('click');

        setImmediate(() => {
            wrapperList.update();
            expect(wrapperList.state().searchInput).toEqual("Title");
            expect(wrapperList.state().events).toEqual(events);
            expect(wrapperList.state().searching).toEqual(true);
        });

    });

    it('Search for events by text - ERROR', () => {

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

        mockAxios.onGet().reply(400, {});

        wrapperList.setState({
            searchInput: "Title",
            fixedSearchInput: "Title"
        });

        let searchButton = wrapperList.find(".btn-search").first();

        searchButton.simulate('click');

        setImmediate(() => {
            expect(wrapperList.state().alertType).toEqual("danger");
            expect(wrapperList.state().alertMessage).toEqual('Ocorreu um erro. Não foi possível efetuar a pesquisa.');
        });

    });

    it('Search for events by text - Delete Search Text', async() => {

        const events = [{
            id: 1,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
        },
        {
            id: 2,
            title: 'Title',
            description: 'description',
            start_date: '2018-10-27 11:11:00',
            end_date: '2018-10-28 11:11:00',
            entity: {
                initials: 'FEUP'
            }
        }];

        mockAxios.onGet().reply(200, {
            count: 7,
            rows: events
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

        wrapperList.setState({
            searchInput: "Title",
            fixedSearchInput: "Title",
            searching: true,
            events: [events[0]]
        });

        wrapperList.instance().deleteSearchText();

        setImmediate(() => {
            expect(wrapperList.state().searchInput).toEqual("");
            expect(wrapperList.state().fixedSearchInput).toEqual("");
            expect(wrapperList.state().searching).toEqual(false);
            expect(wrapperList.state().events).toEqual(events);
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
                entity: {
                    initials: 'FEUP'
                }
            },
            {
                id: 2,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                entity: {
                    initials: 'FEUP'
                }
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
                entity: {
                    initials: 'FEUP'
                }
            },
            {
                id: 2,
                title: 'Title',
                description: 'description',
                start_date: '2018-10-27 11:11:00',
                end_date: '2018-10-28 11:11:00',
                entity: {
                    initials: 'FEUP'
                }
            }]
        });

        await wrapperList.update();
        expect(wrapperList.state().events.length).toEqual(2);
        wrapperList.instance().deleteEventFromArray(-1);

        await wrapperList.update();
        expect(wrapperList.state().events.length).toBe(2);

    });
});

describe("Handle filter changes", () => {

    it('Check events on entities change', () => {
        const wrapper = mount(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={jest.fn()}
                    categories={[{ value: 1, label: 'Test' }]}
                    entities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]}
                />
            </BrowserRouter>
        );

        let wrapperList = wrapper.find(ListEvents).first();

        wrapper.find('.entities__dropdown-indicator').first().simulate('mouseDown', { button: 0 });
        expect(wrapper.find('.entities__option').length).toEqual(2);

        wrapper.find('.entities__option').first().simulate('click', null);
        expect(wrapperList.state().chosenEntities).toEqual([{ value: 1, label: 'Test' }]);

        wrapper.find('.entities__option').first().simulate('click', null);
        expect(wrapperList.state().chosenEntities).toEqual([{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]);
    });

    it('Check events on categories change', () => {
        const wrapper = mount(
            <BrowserRouter>
                <ListEvents
                    refreshListEvents={false}
                    updateRefreshEvents={jest.fn()}
                    categories={[{ value: 1, label: 'Test' }]}
                    entities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]}
                />
            </BrowserRouter>
        );

        let wrapperList = wrapper.find(ListEvents).first();

        wrapper.find('.categories__dropdown-indicator').first().simulate('mouseDown', { button: 0 });
        expect(wrapper.find('.categories__option').length).toEqual(1);

        wrapper.find('.categories__option').first().simulate('click', null);
        expect(wrapperList.state().chosenCategories).toEqual([{ value: 1, label: 'Test' }]);
    });

});
