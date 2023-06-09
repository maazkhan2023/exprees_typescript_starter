FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN npm run prepare

RUN npm install --global nodemon

COPY . .

EXPOSE 3030

CMD ["npm", "run", "dev"]