FROM node:8.12.0

RUN mkdir /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json /usr/src/app/package.json
RUN npm install
RUN npm install react-scripts@2.0.4 -g
RUN npm i --save @fortawesome/fontawesome-svg-core \
  npm i --save @fortawesome/free-solid-svg-icons \
  npm i --save @fortawesome/react-fontawesome
COPY . /usr/src/app
EXPOSE 3000
CMD ["npm", "start"]