FROM node:18-alpine AS frontend

WORKDIR /app

COPY . .

RUN yarn

CMD ["yarn", "build:prod"]
