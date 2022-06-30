FROM node:18-alpine3.15

COPY . . 

RUN npm install

CMD [ "node" , "index.js" ]