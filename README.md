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

__NOTE__ If you're using the NoxPlayer Emulator, connect the device with adb command, run expo android and then expo start

## Running the tests

To run the tests, open a new terminal inside the _api_ folder and run command _npm test_

### Test Examples

* /GET List Events App -  It tests the return of all events on the app, listing them by order of the attribute start_date
* /POST Add Event - It tests the addition of an event to the database

## Built with

* React-Native - The Android Framework

## Servers

* **Staging**: 
    - Web - 188.166.95.23:3000
    - API - 188.166.95.23:3030
* **Production**: 
    - Web - 188.166.41.239:3000
    - API - 188.166.41.239:3030

## API Documentation

To access the documentation of the API:
* **Staging**: 
    - 188.166.95.23:3030/docs
* **Production**: 
    - 188.166.41.239:3030/docs


## Authors

* **Daniel Marques** - *Developer* - [rendoir](https://gitlab.com/rendoir)
* **Danny Soares** - *Developer* - [dannysoares](https://gitlab.com/dannysoares)
* **Leonardo Teixeira** - *Developer* - [LeoTeixeira](https://gitlab.com/LeoTeixeira)
* **Margarida Silva** - *Scrum Master* - [BeeMargarida](https://gitlab.com/BeeMargarida)
* **Ricardo Santos** - *Developer* - [rjsantos](https://gitlab.com/rjsantos)
* **Tiago Carvalho** - *Developer* - [TiagoC97](https://gitlab.com/TiagoC97)
* **Vítor Magalhães** - *Surrogate Product Owner* - [LastLombax](https://gitlab.com/LastLombax)

## Screenshots of Sprint 1


### Logo
<img src="https://i.imgur.com/FfCDDEE.png">

### App
<img src="https://i.imgur.com/c6PU8Ia.jpg">

### Web
<img src="https://i.imgur.com/lfQG6y0.png">


