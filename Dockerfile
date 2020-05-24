FROM node:alpine

ARG ADMIN_NAME 
ARG PASSWORD
ARG SECRET
ARG PGUSER
ARG PGHOST
ARG PGPASSWORD
ARG PGDATABASE
ARG PGPORT

ENV ADMIN_NAME=ADMIN_NAME 
ENV PASSWORD=PASSWORD
ENV SECRET=SECRET
ENV PGUSER=PGUSER
ENV PGHOST=PGHOST
ENV PGPASSWORD=PGPASSWORD
ENV PGDATABASE=PGDATABASE
ENV PGPORT=PGPORT

WORKDIR /luiza-api 

COPY src/ src/ 
COPY package.json package.json
COPY package-lock.json package-lock.json
COPY run.js run.js

RUN npm install 

EXPOSE 3000

CMD ["node", "run.js"]

docker run --name luiza-api -e ADMIN_NAME=luiza -e PASSWORD=luizathebest -e SECRET=simba -e PGUSER=boo -e PGHOST=localhost -e PGPASSWORD=boodb -e PGDATABASE=postgres -e PGPORT=5432 --network=host luiza-api 