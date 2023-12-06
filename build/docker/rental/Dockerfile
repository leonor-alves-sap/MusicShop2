FROM node:18 AS build

LABEL mantainer="Leonor"

WORKDIR /app

COPY ./rental/package*.json .

RUN npm install

COPY ./rental .

RUN npm run tsc

FROM node:18

WORKDIR /app

COPY --from=build ./app/dist ./dist

COPY --from=build ./app/package*.json .

RUN npm install --only=production

EXPOSE 3000 

CMD [ "node","./dist/src/index.js" ]