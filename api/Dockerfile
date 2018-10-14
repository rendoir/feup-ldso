FROM node:8

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm install #--only=production # uncomment if building for release

# Bundle app source
COPY . .

# Map app port to docker port
EXPOSE 3000

CMD ["npm", "start"]
