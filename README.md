# Cultural Agenda of University of Porto


University of Porto's cultural agenda. It will contain all the events of all the faculties and cultural organizations related to UPorto, for ease of access to such information, as well as an event management for organizations

## Getting Started

These instructions will show you how to install the project

### Prerequisites

You will need:

* Docker - https://www.docker.com/get-started 
* Node.js and npm - https://nodejs.org/en/download/
* Expo - https://expo.io/learn
* Expo App on Android
* PostgreSQL
* Android Studio Emulator - If you don't have an Android, you can use the AS emulator to test.

### 1st time Configuration

* To setup the app and the web, run **npm install** inside the _api_ and _web_ folders, respectively

* To set up docker, run **docker-compose up** in the root of the project.

## Running for development

After having everything installed, follow these instructions to run the project.

1. Inside the _api_ folder, open a terminal and run **npm run start**. This will start the Node server for backend endpoints.
2. Open Docker. If you're using Docker Toolbox, you can use Kinematic, the Docker GUI.

This will start your backend server, as well as the container for PostgreSQL.

Now you're ready to start the app. This is all inside the _mobile_ folder

3. Run **npm install**
4. Inside the file _AgendaScreen.js_, change the IP to your machine's wifi IP.
5. Run **expo start**. Inside the terminal, there should be a QRCode to be read via the Expo App.
  * If you're using the Emulator, click the button "Open in Android Emulator"


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



