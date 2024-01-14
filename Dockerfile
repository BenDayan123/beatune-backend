FROM node:20 AS build

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i

COPY . .

RUN npm run build

FROM node:20
ARG NODE_ENV=production
ENV NODE_ENV = ${NODE_ENV}
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/dist ./dist

COPY package*.json ./
RUN npm i --only=production

RUN rm package*.json
EXPOSE 4000

CMD ["node", "dist/main.js"]