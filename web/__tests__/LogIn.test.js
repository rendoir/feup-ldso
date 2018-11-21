import React from 'react';
import rendered from 'react-test-renderer';
import { BrowserRouter } from 'react-router-dom';
import LogIn from '../src/LogIn';
import { mount } from 'enzyme';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

var mockAxios = new MockAdapter(axios);

document.cookie = undefined;

describe("Check Render ListEvents", () => {

    it('renders log in form', () => {

        const listEvents = rendered.create(
            <BrowserRouter>
                <LogIn />
            </BrowserRouter>
        );
        let tree = listEvents.toJSON();
        expect(tree).toMatchSnapshot();
    });

});

describe("Check Update Functions", () => {

    var wrapper;

    beforeAll(async() => {
        document.cookie = undefined;

        wrapper = await mount(
            <BrowserRouter>
                <LogIn />
            </BrowserRouter>);
    });


    it('check update email input', async() => {

        let wrapperLogIn = wrapper.find(LogIn).first();

        const input = await wrapperLogIn.find("input.email-input").first();
        await input.simulate('change', {
            target: { value: 'email@email.com' }
        });

        await wrapperLogIn.update();
        expect(wrapperLogIn.state().emailInput).toEqual('email@email.com');

    });

    it('check update password input', async() => {

        let wrapperLogIn = wrapper.find(LogIn).first();

        const input = await wrapperLogIn.find("input.password-input").first();
        await input.simulate('change', {
            target: { value: 'verysecurepassword' }
        });

        await wrapperLogIn.update();
        expect(wrapperLogIn.state().passwordInput).toEqual('verysecurepassword');

    });

});

describe("Login", async() => {


    it("Check login returns error", () => {

        let wrapper = mount(
            <BrowserRouter>
                <LogIn />
            </BrowserRouter>);

        let wrapperLogIn = wrapper.find(LogIn).first();

        wrapperLogIn.setState({
            emailInput: "email@test.com",
            passwordInput: "test"
        });

        mockAxios.onPost().reply(400);

        let button = wrapper.find('button#login-button').first();
        button.simulate('submit');

        setImmediate(() => {
            expect(wrapperLogIn.state().alertMessage).toEqual("Error logging in: undefined");
            expect(wrapperLogIn.state().alertType).toEqual("danger");
        });

    });

    it("Check login is successful", () => {

        let wrapper = mount(
            <BrowserRouter>
                <LogIn />
            </BrowserRouter>);

        let wrapperLogIn = wrapper.find(LogIn).first();

        wrapperLogIn.setState({
            emailInput: "email@test.com",
            passwordInput: "test"
        });

        mockAxios.onPost().reply(200, {
            token: undefined
        });


        let button = wrapperLogIn.find('button#login-button').first();
        button.simulate('submit');

        setImmediate(() => {
            expect(wrapperLogIn.state().alertMessage).toEqual("Successfully logged in!");
            expect(wrapperLogIn.state().alertType).toEqual("success");
        });

    });


});
