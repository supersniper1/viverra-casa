FROM python:3.9-slim AS backend

WORKDIR /app

COPY requirements.txt .

RUN pip3 install -r requirements.txt --no-cache-dir

COPY . .

CMD ["gunicorn","-k", "eventlet", "Viverabackend.asgi:application", "--bind 0.0.0.0:8000"]

#CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "Viverabackend.asgi:application"]
