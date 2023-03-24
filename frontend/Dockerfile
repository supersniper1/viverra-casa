FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn

CMD ["yarn", "build:prod"]

EXPOSE 2004