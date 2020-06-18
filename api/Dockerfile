FROM node:12.17

WORKDIR /usr/src/cas-api

COPY package.json package-lock.json ./

RUN npm install

COPY ./ ./

CMD npm run start

EXPOSE 3300
