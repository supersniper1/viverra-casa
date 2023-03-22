FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn

CMD ["node", "src/index.ts"]

EXPOSE 2004