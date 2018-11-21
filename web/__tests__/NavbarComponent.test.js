import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../src/NavbarComponent';
import { mount } from 'enzyme';
import sinon from 'sinon';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

var mockAxios = new MockAdapter(axios);

describe("Logout", () => {

    it("Check logout is successful", async() => {
        document.cookie = "access_token=12345";

        let spy = sinon.spy(Navbar.prototype, 'getTokenFromCookie');

        const wrapper = mount(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>);

        let wrapperNavbar = wrapper.find(Navbar).first();
        wrapperNavbar.instance().getTokenFromCookie = jest.fn(() => "");

        mockAxios.onPost().reply(200);

        const button = wrapper.find('button#logout-button').first();
        button.simulate('click');

        expect(spy.calledOnce);

    });

    it("Check getTokenFromCookie is successful", async() => {
        document.cookie = "access_token=12345";

        const wrapper = mount(
            <BrowserRouter>
                <Navbar />
            </BrowserRouter>);

        let wrapperNavbar = wrapper.find(Navbar).first();
        let result = wrapperNavbar.instance().getTokenFromCookie();

        expect(result).toEqual("12345");

    });


});
