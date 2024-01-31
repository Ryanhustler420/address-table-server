FROM node:20

ARG NODE_ENV=development
ARG ADMIN_PASSWORD=something
ARG DATABASE=address-table-server
ARG MONGO_URI=mongodb://mongodb:27017
ARG RABBIT_MQ=amqp://appname:password@localhost:port

# Please dont change this here, You can change this via outside
ENV NODE_ENV=${NODE_ENV}

# Set environment variables
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}
ENV MONGO_URI=${MONGO_URI}
ENV RABBIT_MQ=${RABBIT_MQ}
ENV DATABASE=${DATABASE}
ENV JWT_KEY=something
ENV PORT=8081

WORKDIR /app
COPY package*.json .
COPY tsconfig.json .

RUN apt-get update
RUN apt-get -y install nano
RUN apt-get -y install python3
RUN apt-get -y install systemd
RUN apt-get -y install gcc g++ make
RUN curl -LO https://github.com/prometheus/node_exporter/releases/download/v1.2.2/node_exporter-1.2.2.linux-amd64.tar.gz \
    && tar xzf node_exporter-1.2.2.linux-amd64.tar.gz \
    && cp node_exporter-1.2.2.linux-amd64/node_exporter /usr/local/bin/ \
    && rm -rf node_exporter-1.2.2.linux-amd64 node_exporter-1.2.2.linux-amd64.tar.gz
RUN npm install

COPY . .

EXPOSE ${PORT}
CMD [ "npm", "run", "watch" ]
