FROM joyzoursky/python-chromedriver:3.8

WORKDIR /app

COPY requirements.txt .

RUN pip3 install -r requirements.txt --no-cache-dir

COPY . .

CMD ["uvicorn", "Viverabackend.asgi:application", "--host", "0.0.0.0", "--port", "8000"]
