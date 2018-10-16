FROM postgres:latest

ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD example
ENV POSTGRES_DB postgres

EXPOSE 5432

ADD database/db.sql /docker-entrypoint-initdb.d/
ADD database/seed.sql /docker-entrypoint-initdb.d/
