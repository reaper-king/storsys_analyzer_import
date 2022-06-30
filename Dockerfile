FROM node:18-alpine3.15


WORKDIR /App


COPY ./* /App/


RUN npm i


CMD [ "node" , "index.js" ]
