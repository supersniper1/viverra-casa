FROM node:18-alpine AS app

COPY ./frontend .

RUN yarn

CMD ["yarn", "build:prod"]

EXPOSE 2004

FROM python:3.9 AS app

WORKDIR /app

COPY Viverabackend/requirements.txt .

RUN pip3 install -r requirements.txt --no-cache-dir

COPY ./Viverabackend .

CMD ["gunicorn", "Viverabackend.wsgi:application", "--bind", "0:8000" ]