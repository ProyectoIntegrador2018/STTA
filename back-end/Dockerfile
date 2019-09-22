FROM python:3.6-slim-stretch
EXPOSE 8000
ENV PYTHONUNBUFFEREF 1
RUN mkdir /stte-back
WORKDIR /stte-back
COPY . /stte-back/

RUN pip install -r requirements.txt
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
