FROM node:7.8-slim
# App workdir
WORKDIR /app

# Copy app dependencies
COPY package.json ./

# Install dependecies
RUN npm install -g mocha mocha-jenkins-reporter
RUN npm --allow-root install

# Build app source code
COPY . ./

# Run the tests!
CMD ["npm", "start"]