FROM python:3.9 AS backend

WORKDIR /app

COPY Viverabackend/requirements.txt .

RUN pip3 install -r requirements.txt --no-cache-dir

COPY ./Viverabackend .

CMD ["gunicorn", "Viverabackend.wsgi:application", "--bind", "0:8000" ]