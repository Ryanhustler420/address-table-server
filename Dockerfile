FROM node:18-alpine

# Please dont change this here, You can change this via outside
ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

# Set environment variables
ENV JWT_KEY=something
ENV PORT=3000

WORKDIR /app
COPY package*.json .
COPY tsconfig.json .

RUN npm install -g typescript
RUN npm install

COPY . .

RUN npm run build

EXPOSE $PORT
CMD [ "npm", "start" ]
