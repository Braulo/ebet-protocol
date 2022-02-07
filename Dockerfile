FROM node:16

WORKDIR /app

COPY . . 

RUN npm i

RUN npm i -g truffle

CMD bash -c "truffle compile;"