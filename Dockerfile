FROM python:3.9

WORKDIR /app

COPY Viverabackend/requirements.txt .

RUN pip3 install -r requirements.txt --no-cache-dir

COPY . .

CMD ["gunicorn", "Viverabackend.wsgi:application", "--bind", "0:8000" ]

FROM node:18-alpine

WORKDIR /app/frontend

RUN yarn

CMD ["yarn", "build:prod"]

EXPOSE 2004