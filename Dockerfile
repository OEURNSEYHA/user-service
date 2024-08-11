FROM node:20-alpine

WORKDIR /app

COPY package.json .
RUN yarn install

COPY ./src ./src
COPY tsconfig.json nodemon.json tsoa.json ./

CMD ["npm", "run", "dev"]
