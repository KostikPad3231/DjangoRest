FROM python:3.11

RUN pip install pipenv==v2023.9.1 --upgrade pip
RUN pip install psycopg2 flower

ADD ./Pipfile ./tmp/Pipfile
ADD ./Pipfile.lock ./tmp/Pipfile.lock
RUN cd /tmp && pipenv install --system --deploy

RUN apt-get update
RUN apt-get install binutils libproj-dev gdal-bin -y