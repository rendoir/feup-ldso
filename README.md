# Cultural Agenda of University of Porto


University of Porto's cultural agenda. It will contain all the events of all the faculties and cultural organizations related to UPorto, for ease of access to such information, as well as an event management for organizations

## Getting Started

These instructions will show you how to install the project

### Prerequisites

You will need:

* Docker - https://www.docker.com/get-started 
* NodeJS and npm - https://nodejs.org/en/
* Expo - https://expo.io/learn
* Expo App on Android
* Android Studio Emulator - If you don't have an Android, you can use the AS emulator to test.

### 1st time Configuration

* Run **docker-compose build** in the root of the project, to setup the app and the web modules.
* Run **npm install** in the _mobile_ folder.

## Running for development

1. Run `docker-compose up` in the root of the project
2. In the file _mobile/global.js_, change the presented IP to your machine's wifi IP.
3. Run `expo start`. Inside the terminal, there should be a QRCode to be read via the Expo App.
    3.1. You can also access more information in indicated localhost IP.

<img src="https://i.imgur.com/I8ZyCta.png"  width="450" height="450">


### Running with an Android Emulator

If you're using an Android emulator, such as the NoxPlayer Emulator:

1. Connect the device with the `adb connect` command(for example, `adb connect 127.0.0.1:62001`) and
run the emulator. 
2. Run `expo start` and, in the indicated localhost IP, select **Run on Android device/emulator**. 

## Running the tests

To run the tests, open a new terminal inside the _api_ folder and run command _npm test_

### Test Examples

* /GET List Events App -  It tests the return of all events on the app, listing them by order of the attribute start_date
* /POST Add Event - It tests the addition of an event to the database

## Built with

* React-Native - The Android Framework

## Authors

* **Daniel Marques** - *Developer* - [rendoir](https://gitlab.com/rendoir)
* **Danny Soares** - *Developer* - [dannysoares](https://gitlab.com/dannysoares)
* **Leonardo Teixeira** - *Developer* - [LeoTeixeira](https://gitlab.com/LeoTeixeira)
* **Margarida Silva** - *Scrum Master* - [BeeMargarida](https://gitlab.com/BeeMargarida)
* **Tiago Carvalho** - *Developer* - [TiagoC97](https://gitlab.com/TiagoC97)
* **Ricardo Santos** - *Developer* - [rjsantos](https://gitlab.com/rjsantos)
* **Vítor Magalhães** - *Surrogate Product Owner* - [LastLombax](https://gitlab.com/LastLombax)

## Screenshots of Sprint 1


### Logo
<img src="https://i.imgur.com/FfCDDEE.png">

### App
<img src="https://i.imgur.com/c6PU8Ia.jpg">

### Web
<img src="https://i.imgur.com/lfQG6y0.png">


