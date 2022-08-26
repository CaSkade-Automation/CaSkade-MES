FROM node:18-alpine

# Create app directory
WORKDIR /usr/skillmex

# Copy code
COPY . .

# Install frontend dependencies
WORKDIR /usr/skillmex/frontend
RUN npm install
RUN npm run ng-build

WORKDIR /usr/skillmex/backend
RUN npm install


