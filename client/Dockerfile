FROM node:18-alpine

ENV PORT=4001

WORKDIR /app

COPY package*.json .
COPY tsconfig.json .

RUN npm install

COPY . .
EXPOSE ${PORT}
CMD [ "npm", "start" ]