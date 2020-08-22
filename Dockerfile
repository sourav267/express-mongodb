FROM node:8.11.1-alpine

# WORKDIR /usr/src/app

# VOLUME [ "/usr/src/app" ]

# RUN npm install -g nodemon

# ENV PORT=3000

# EXPOSE 3000

# CMD [ "nodemon", "-L", "server.js" ]

# FROM node:8
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Copy app source code
COPY . .
#Expose port and start application
EXPOSE 8080
CMD [ "npm", "start" ]