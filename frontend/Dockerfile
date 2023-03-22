FROM node:18-alpine

WORKDIR /app

COPY . .

RUN yarn

CMD ["node", "src/index.tsx"]

EXPOSE 2004