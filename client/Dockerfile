FROM node:18-alpine

ENV PORT=3000

WORKDIR /app

COPY package*.json .
COPY tsconfig.json .

RUN npm install --force

COPY . .
EXPOSE ${PORT}
CMD [ "npm", "start" ]