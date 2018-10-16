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

1. Run **docker-compose up** in the root of the project
2. In the file _mobile/screens/AgendaScreen.js_, change the IP to your machine's wifi IP.
3. Run **expo start**. Inside the terminal, there should be a QRCode to be read via the Expo App.

<img src="https://i.imgur.com/I8ZyCta.png"  width="450" height="450">

__NOTE__ If you're using the Emulator, open your browser, type the indicated IP where the Expo DevTools is running and click the button "Run on Android device/emulator"


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

<img src="https://i.imgur.com/c6PU8Ia.jpg">
