FROM node:18-alpine AS frontend

WORKDIR /app

COPY package*.json ./

RUN yarn

COPY . ./

CMD ["yarn", "build:prod"]
