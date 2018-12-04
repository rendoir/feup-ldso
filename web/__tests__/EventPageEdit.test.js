import React from 'react';
import rendered from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import EventPageEdit from '../src/EventPageEdit';
import { mount } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

var mockAxios = new MockAdapter(axios);
document.cookie = "access_token=123";

var props = {
    match: {
        params: {
            id: 1
        }
    }
};

mockAxios.onGet().reply(200, {
    id: 1,
    title: 'Title',
    title_english: 'Title',
    description: 'description',
    description_english: 'description',
    start_date: '2018-10-07 01:10:00',
    end_date: '2018-10-08 01:10:00',
    entity_id: 1,
    location: 'Porto',
    price: 10,
    entity: {
        id: 1,
        initials: 'Test'
    },
    categories: [
        {
            id: 1,
            name: 'Test'
        }
    ]
});

describe("EventPageEdit Render", () => {

    it('renders form with one entity', () => {

        const form = rendered.create(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }]} />
            </BrowserRouter>
        );

        let tree = form.toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('componentDidMount - event does not exist', (done) => {

        mockAxios.onGet().reply(200, "");

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();

        setImmediate(() => {
            expect(wrapperForm.state().alertType).toEqual("danger");
            expect(wrapperForm.state().alertMessage).toEqual("Este evento não existe.");
            done();
        });
    });

    it('componentDidMount - error of server', (done) => {

        mockAxios.onGet().reply(400);

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();

        setImmediate(() => {
            expect(wrapperForm.state().alertType).toEqual("danger");
            expect(wrapperForm.state().alertMessage).toEqual("Ocorreu um erro. Por favor tente novamente.");
            done();
        });
    });


});

describe("EventPageEdit Inputs Change", () => {

    it('Check state on title input change', () => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]} />
            </BrowserRouter>);

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10
        });

        const input = wrapper.find('input#edit-form-title.form-control').first();

        input.simulate('change', {
            target: { value: 'Title' }
        });

        expect(
            wrapperForm.state().title
        ).toEqual('Title');


    });

    it('Check state on title_english input change', () => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]} />
            </BrowserRouter>);

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10
        });

        const input = wrapper.find('input#edit-form-title-english.form-control').first();

        input.simulate('change', {
            target: { value: 'Title' }
        });

        expect(
            wrapperForm.state().title_english
        ).toEqual('Title');


    });

    it('Check state on description input change', () => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10
        });

        const input = wrapper.find('textarea#edit-form-descriptionAndImage.form-control').first();

        input.simulate('change', {
            target: { value: 'Description' }
        });

        expect(
            wrapperForm.state().description
        ).toEqual('Description');

    });

    it('Check state on description_english input change', () => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10
        });

        const input = wrapper.find('textarea#edit-form-descriptionAndImage.form-control.description_english').first();

        input.simulate('change', {
            target: { value: 'Description' }
        });

        expect(
            wrapperForm.state().description_english
        ).toEqual('Description');

    });

    it('Check state on image input change', () => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]} />
            </BrowserRouter>
        );

        mockAxios.onGet().reply(400);
        const image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC8AAAAnCAIAAAAQFoaWAAAF" +
            "yHpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjanZZ/susoDoX/ZxWzBJAEguXws6p3MMufDyd5c++t16+62iQxwbaQ" +
            "jo6OHPZ//zrhPxwpxxgsey2tlMhhzZp0JjW+jjsffIXvei3VEj9Hiu35fY4g59fytwvi72X5vv45p/7DkL13T+P7hc+61B+" +
            "G5HXSuwHzZG9D7T1JyvJvdi6terT//+/vDc47xOLZSvUcyioiUVW2Fr7y2k2jJq3aOTd+RZ17XnPTwm/SG/pjjN2Zh/j2SO/j" +
            "oiDV0r3wWX8C0DfyX9afre4FwLq2ws9Qorwu/AL9kwz9se7x2xEe95TL+sVY+X1m/pSY8KfMPGF9AdrsPZPv641/4at756x6zn7" +
            "usG4FgpY3wz7Bp/d90NRuDJlI7I7AJL+mnO8oQDrhtr/HgdsDf2dK8SRh3PM9NJU0k3O21EPKz2Llek09LcZ5hiYXERNJW4wHNmv7" +
            "ly/pva0/G+9YA3tvbjKMWdr/foR/euM580KUbkHf1EML/JKblhtsAqN74jZ70vrJif7K4M/DHnLkN1H99aTMkF75sIdJr2EvJn+RC3" +
            "lWQfNyDLiVD1AAIRAXwI0O2Cqgaqrj41d5Ep7+1qcPFeTtjd0NwtsTe/Lw2wcSLkSq8MS7fyeBqoWsj1eCz7ryN8MbjQvYRSsqtXVkt" +
            "1xGuXKpKR8psxcubG1zaFrTl/Wyxtm9Abye1HcYKqfsXWYyS605IUtBNuqOU4dce0vrSdWaQrTi69wy7pYXdmbr2xSLFmyDkMI4aOVr4s" +
            "ZITU/e27XvNoaWuiQjX6viVHe3deCeZGnx5G7mc86YQ55UFLumXVZL7VZF8zKPp7rKXG32Sdyrkg4giXv3LVDXy3W4NKISXW33MOKymnsa" +
            "efvcWaD72Q5ZcBooyto9d+aprDO61QHZqhG9zQLgpjaJ32ow9qMJ5eKj2Mb11KZfC7Ot3HLKxLvGcnPvyp8+d61TEYlVVm1xmOR5NlkjnYeL" +
            "fi6hlqTqm9o9NvMkKcVb25HeNx1F36p1r7b0QrH2GlOG1MXZQ59zHK9HFkJRa0dPzO8uuxHxlCbW55F5hiU7JW0fe0QvO+vKONzmHuPkE6SQ9" +
            "lEVmFrFXurWTyQmIbHdBNotPabtDG8LbE4TaAHjxoz4sFLOcGSEtvOqY0Qg3WnSkmYXt1nbnniULwlKiw1Sl2yZtCbsVKu6Bq6pj9H8uJcAYTp" +
            "W1bzlm9dy4FJq2Fi5D73MxYS02Y7ODOOskL0KZ/fpwEl2k1uLgbze2liDmx0WklEkkYaKCenZJ01x+13GNOA1FwpeMzyfie0SoNQOj2BjhZNbtL" +
            "ExFTrHYJLtJuj0CCV3MehYaoPVM669m4Ozpj22AxDQtNrDSgVc2H/JHH12eovXKi0/rZWc0aw73Mtj1bLE+2DoHO24Ymxl6VRgsVBKsq01T89U4r" +
            "ZHIanQU6kSLCEeuzakAicgqOaJ/9mcxNIXFvalwfwUlk+Fu4IRWn+HbMhwRjSqEwYEp0oWDRAaQCXqrZwE52lbYqb5ANZYcfTQvcdBYP2CTY47Lzd" +
            "SJ81X7isQE6mUz9aMLqE4bpUUkOmDNFTKgNIhRSvQKpdlHRP2HcoWPRcjLu08pRmPxmUBr4ln5NYeseoFCl/9oqTJQ1+6aqDUIsoA4Y9Coat2/YZU4i7" +
            "qE/8zokiRtCnsLgsWj1aGO2yIrcpKMEJHqGdmCtOOwZF+O34WeD4b3V+RzUrGEIKUxlR0yofX20HSQQj39Aq9anbAbnVXsjjSrDJqy65ISnSeyLpj6Xco" +
            "2g3ZU6HeqW+Umdc8VtO2yiMNBks496Vw9jUQo8YrAFtSpBvm0yo2ZTgLXMxnozSFt4cOvniutmbdoHAkH8Xv4Dd+Klx81lOXMdCvuoF4neYZ3e3UAFLn6VT" +
            "MHDsd2Ch5mgzanne8FApOYnjnhGRjDmtlRd0z3h6kB8kEVkiohlzlQw9r4X+9JOdogE2r2AAAAANzQklUCAgI2+FP4AAABRFJREFUWIXtmG1MU1cYx597W1" +
            "qwYDHY0kFXW6kwQQcyERBfkFDerEhlsC0KM5E52XBZZqYz0WRxycjmEjLNjG4ORQiVzXWObMwBokal29LxKgihFUqrtKW3BWxtKX3ZhzLp5F7qOqN+4P/pnvO" +
            "ce88vz3n7n4sIMnfEbt9dsG5ZCI2M/XrkUK0cAAAoLyTni3LW8Nl0knVcr5Lfviy58McIeJM/d6OoMDOWz6KBWa/sajpX2apyAAAgC6O2FG9LWxkeTLboBtrqa3" +
            "64obYBAEBMycmyReL3j16bBEAEGdle+3hqQp81wL80T0OseRpiPV80pMZWqZBvaG5VOp41CgCgx1ruP2uGGT1fI0UmqKeEryvMF65ZyvC3Yuq+K+ILlwZMLu+fo3" +
            "LWby3IWrWMRUPN+sGupuozUrV7CgTxN+/IF8Sy6X6W0X7ZjzUS6T07AADElJzcQ5WcGV+VmxyBTxO8oWzfTmZ71fHyW0aUlVjw7oG3pj6qaNbPjYKECsoOvxHUfr" +
            "66vENrC2RFr+cxSKB2AEBQyq6ygrC2sxVV/RZm8vbid/bZdQckCvt0ShI2rz53tHzvXdyR4qRujRtvOFF9bUCL6Ud6fhE33I3clMLwkhckMjuXP9FYebKxV6nDRu70" +
            "XK76ud19MjLWZsXbW2vFV/s1I8NdktNNQ4yNmXEzfetvNLSoJ50uvNws4HGYEJK+/7PUf2r8FgCqXgwwOhdN8ItL6FMKuco5O8QKZcG960NT08XR4SEzhcNaBIBNV+" +
            "jdacejQUkkcPaKD4s7PD88ZZ4LBQAQBAGiqYXgVLlmGjud7mfUYp0EKpXi2c6kVGEom8M0jXvqgd0LjVGlnKAsjWDj9KzVaSGMx/ObLjI4XNqURjc2qx0pfEVWatZyZ" +
            "OC2xkb2Qxw2uxPAqLXy00SpSxyjmMlOCeFEJqSL4lFZr3ZuHExjj8rJSwwz63T3XQEM7uotCcF9co0DwDzqiEjfkhQyptRaabyMnduSkZuV1T0GJwAw44VrAm5dalU6A" +
            "EhLFpA0gbGCgsLcPOErfp0t3QYAsAzJunX06E052SLhxqQV7ECrsuOv3rsmL9kxKdq7xpjxgsw8UcamBN5CQ+/vbaoJFwBMDt8adHITs/OEwrSYRVhb7amLHWPupe9JM+" +
            "/9iDVPQ6x5GmI9XzSIXDsKXd+6r3r/WyvfPP1hEnW6oK0/9PH3w57hgNWlRwqNXx08P0RgNJ+s9+uuKikuLSouLfrgp0GcsEUmabYKCjNCid5/yiOlbW3p42RlRBB064P" +
            "3Y+d+/in3t0PXGa/lbohi+NvHuusqKq5gj4dzXyZT7CpMXF6j6ME57330fuzcPak3Jd8cPK53BEdEB3s73j1kkg9qaHHRHOhRzg766P1ohutV38nujVttJs3tP/vGH58GjAY" +
            "jLGbiG0kfvZ9xYMDwHwg8ZbPbgEShkgBmLywfvZ/F/MBHGAiiBcGD4QncNU5+6P1m9huTUoWhcRym6Vr/k7+AouzwMJfyKt4GAIBq5HIrPyUtJpROpwf6u1OluHKxOyDt7RJhP" +
            "DeMweS+tErweumrLz8RGIS3fBn1Tk8XvnEjW2V1Z5t3F+wtz/L474dd/fKLyXxRTtF7+Q//+815X3hcoZHr19La66QE+wEZXFhnTXlnzSP1thGp+IRUjPeKun5/cb1vMPSUzL" +
            "Wmpk+kRJOOaPfzTSuLTu1L8nc/O7Wdj4YDGKii6utGvBuXW38DUypCM1Vqx7oAAAAASUVORK5CYII=";

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10,
            chosenCategories: [1],
            chosenEntity: { value: 1, label: 'Test' },
            image: "http://" + process.env.REACT_APP_API_URL + ":3030/1",
            displayImage: ""

        });

        global.URL.createObjectURL = jest.fn();

        let input = wrapper.find('input#edit-form-image.form-control-file').first();

        input.simulate('change', {
            target: { files: [image] }
        });

        expect(
            wrapperForm.state().image
        ).toEqual(image);

    });

    it('Check state on start date input change', () => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10
        });

        const input = wrapper.find('input#edit-form-date-start.form-control').first();
        let date = new Date();
        date = new Date(date.getDay() + 1);

        input.simulate('change', {
            target: { value: date.toISOString() }
        });

        expect(
            wrapperForm.state().startDate
        ).toEqual(date.toISOString());

    });

    it('Check state on end date input change', () => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10
        });

        const input = wrapper.find('input#edit-form-date-end.form-control').first();
        let date = new Date();
        date = new Date(date.getDay() + 2);

        input.simulate('change', {
            target: { value: date.toISOString() }
        });

        expect(
            wrapperForm.state().endDate
        ).toEqual(date.toISOString());

    });

    it('Check state on location input change', () => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10
        });

        const input = wrapper.find('input#edit-form-location.form-control').first();

        input.simulate('change', {
            target: { value: 'FEUP, Porto' }
        });

        expect(
            wrapperForm.state().location
        ).toEqual('FEUP, Porto');

    });

    it('Check state on price input change', () => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10
        });

        const input = wrapper.find('input[type="number"]').first();

        input.simulate('change', {
            target: { value: 10 }
        });

        expect(
            wrapperForm.state().price
        ).toEqual(10);

    });

    it('Check state on choosing entity - success', () => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }]}
                    allEntities={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10
        });

        wrapper.find('.entities__dropdown-indicator').first().simulate('mouseDown', { button: 0 });
        expect(wrapper.find('.entities__option').length).toEqual(2);

        wrapper.find('.entities__option').first().simulate('click', null);
        expect(wrapperForm.state().chosenEntity).toEqual({ value: 1, label: 'Test' });

    });

    it('Check state on choosing category - success', () => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }, { value: 3, label: 'Test3' }]}
                    allEntities={[{ value: 1, label: 'Test' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10
        });

        wrapper.find('.categories__dropdown-indicator').first().simulate('mouseDown', { button: 0 });
        expect(wrapper.find('.categories__option').length).toEqual(3);

        wrapper.find('.categories__option').last().simulate('click', null);
        wrapper.find('.categories__option').last().simulate('click', null);
        expect(wrapperForm.state().chosenCategories).toEqual([{ value: 3, label: 'Test3' }, { value: 2, label: 'Test2' }]);

    });

    it('Check go back event', () => {

        var propsVar = {
            match: {
                params: {
                    id: 1
                }
            },
            history: {
                goBack: jest.fn()
            }
        };

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...propsVar}
                    allCategories={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }, { value: 3, label: 'Test3' }]}
                    allEntities={[{ value: 1, label: 'Test' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 01:10:00',
            end_date: '2018-10-08 01:10:00',
            entity_id: 1,
            location: 'Porto',
            price: 10
        });

        wrapperForm.instance().goBack();

        expect(propsVar.history.goBack).toHaveBeenCalled();

    });


});


describe("Check Edit Event Form Requests", () => {

    it('Check axios request POST - Success', (done) => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }, { value: 3, label: 'Test3' }]}
                    allEntities={[{ value: 1, label: 'Test' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10,
            chosenEntity: {
                value: 1,
                label: 'Test'
            },
            chosenCategories: [1, 2]
        });


        mockAxios.onPut().reply(200);

        const button = wrapper.find('div.buttons_style.form-group button.btn.btn-primary').first();

        button.simulate('submit');

        setImmediate(() => {
            expect(wrapperForm.state().redirect).toEqual(true);
            done();
        });

    });

    it('Check axios request POST - Error', (done) => {

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }, { value: 3, label: 'Test3' }]}
                    allEntities={[{ value: 1, label: 'Test' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10,
            chosenEntity: {
                value: 1,
                label: 'Test'
            },
            chosenCategories: [1, 2]
        });

        mockAxios.onPut().reply(400);

        const button = wrapper.find('div.buttons_style.form-group button.btn.btn-primary').first();
        button.simulate('submit');

        setImmediate(() => {
            expect(wrapperForm.state().alertType).toEqual("danger");
            expect(wrapperForm.state().alertMessage).toEqual("Ocorreu um erro. O evento não foi editado. Tente novamente.");
            done();
        });

    });

    it('Check no entity chosen', (done) => {

        mockAxios.onGet().reply(200, {
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-01-07 11:00:00',
            end_date: '2018-01-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10,
            entity: {
                id: 1,
                initials: 'Test'
            },
            categories: []
        });

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }, { value: 3, label: 'Test3' }]}
                    allEntities={[{ value: 1, label: 'Test' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10,
            chosenEntity: null,
            chosenCategories: [1, 2]
        });

        mockAxios.onPut().reply(400);

        const button = wrapper.find('div.buttons_style.form-group button.btn.btn-primary').first();
        button.simulate('submit');

        setImmediate(() => {
            expect(wrapperForm.state().alertType).toEqual("danger");
            expect(wrapperForm.state().alertMessage).toEqual("Escolha uma entidade, por favor.");
            done();
        });

    });

    it('Check no categories chosen', (done) => {

        mockAxios.onGet().reply(200, {
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10,
            entity: {
                id: 1,
                initials: 'Test'
            },
            categories: []
        });

        const wrapper = mount(
            <BrowserRouter>
                <EventPageEdit
                    {...props}
                    allCategories={[{ value: 1, label: 'Test' }, { value: 2, label: 'Test2' }, { value: 3, label: 'Test3' }]}
                    allEntities={[{ value: 1, label: 'Test' }]} />
            </BrowserRouter>
        );

        let wrapperForm = wrapper.find(EventPageEdit).first();
        wrapperForm.setState({
            id: 1,
            title: 'Title',
            title_english: 'Title',
            description: 'description',
            description_english: 'description',
            start_date: '2018-10-07 11:00:00',
            end_date: '2018-10-08 11:00:00',
            entity_id: 1,
            location: 'Porto',
            price: 10,
            chosenEntity: {
                value: 1,
                label: 'Test'
            },
            chosenCategories: []
        });

        const button = wrapper.find('div.buttons_style.form-group button.btn.btn-primary').first();
        button.simulate('submit');

        setImmediate(() => {
            expect(wrapperForm.state().alertType).toEqual("danger");
            expect(wrapperForm.state().alertMessage).toEqual("Não é possível editar um evento sem categorias.");
            done();
        });

    });
});
