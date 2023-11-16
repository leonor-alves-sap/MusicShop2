FROM node:18-alpine as build

WORKDIR /app

COPY ./rental-frontend/package*.json .

RUN npm install

COPY ./rental-frontend .

RUN npm run build


FROM node:18-alpine

WORKDIR /app

COPY --from=build ./app .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]