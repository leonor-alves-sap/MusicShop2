FROM node:18 AS build

LABEL mantainer="Leonor"

WORKDIR /app

COPY ./back-office/package*.json .

RUN npm install

COPY ./back-office .

RUN npm run tsc && cp -R ./src/db/migrations ./dist/db

FROM node:18

WORKDIR /app

COPY --from=build ./app/dist ./dist

COPY --from=build ./app/package*.json .

RUN npm install --only=production

EXPOSE 3000 

CMD [ "node","./dist/index.js" ]

