# FROM node:16.15.0-alpine as shared-build

# WORKDIR /usr/skillmex/shared
# COPY ./shared/package*.json .

# # Install shared dependencies and build
# RUN npm ci --only=production && npm cache clean --force
# COPY ./shared .
# RUN npm run build

FROM node:16.15.0-alpine as frontend-build


WORKDIR /usr/skillmex
COPY ./tsconfig.base.json .
COPY ./shared ./shared

# Copy frontend package.json and package-lock.json
WORKDIR /usr/skillmex/frontend
COPY ./frontend/package*.json .

# Install frontend dependencies and build
# RUN npm i -g @angular/cli @angular-devkit/build-angular
RUN npm install
COPY ./frontend .
RUN npm run build


FROM node:16.15.0-alpine as backend-build
# ENV NODE_ENV production

WORKDIR /usr/skillmex
COPY ./tsconfig.base.json .
COPY ./shared ./shared

# Install backend dependencies and build
WORKDIR /usr/skillmex/backend
COPY ./backend/package*.json .
RUN npm ci --only=production && npm cache clean --force
COPY ./backend .
RUN npm i tsconfig-paths
RUN npm run build

# Copy frontend dist into backend folder to be served
WORKDIR /usr/skillmex
RUN mkdir -p ./backend/frontend-dist
COPY --from=frontend-build /usr/skillmex/frontend/dist ./backend/frontend-dist

# Run the backend dist/main.js
WORKDIR /usr/skillmex/backend
# RUN npm i -g tsconfig-paths
CMD [ "node", "-r", "tsconfig-paths/register" , "dist/main.js" ]

