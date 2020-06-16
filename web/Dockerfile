FROM node:12.17

RUN npm install -g @quasar/cli

WORKDIR /usr/src/cas

COPY package.json package-lock.json ./

RUN ls

RUN npm install

COPY ./ ./

RUN ls

RUN quasar build -m ssr

WORKDIR /usr/src/cas/dist/ssr

RUN ls && npm install

CMD npm run start

EXPOSE 3301
