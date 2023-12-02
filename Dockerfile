FROM node:18-alpine

# Please dont change this here, You can change this via outside
ENV ENV=production 

# Set environment variables
ENV JWT_KEY=something
ENV PORT=3000

WORKDIR /app
COPY package*.json .
COPY tsconfig.json .

RUN npm install

COPY . .
EXPOSE $PORT
CMD [ "npm", "start" ]