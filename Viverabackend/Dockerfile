FROM joyzoursky/python-chromedriver:3.8

WORKDIR /app

COPY requirements.txt .

RUN pip3 install -r requirements.txt --no-cache-dir

COPY . .

CMD ["gunicorn", "Viverabackend.asgi:application", "--bind", "0:8000", "--worker-class", "uvicorn.workers.UvicornWorker"]
