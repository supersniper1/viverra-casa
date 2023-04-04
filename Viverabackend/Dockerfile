FROM python:3.9-slim AS backend

WORKDIR /app

COPY requirements.txt .

RUN pip3 install -r requirements.txt --no-cache-dir

COPY . .

CMD ["gunicorn", "--worker-class eventlet", " -w 1", "Viverabackend.asgi:application"]

# test for windows
#CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "Viverabackend.asgi:application"]
