FROM node:12

WORKDIR /app

COPY . .
RUN npm config set registry http://registry.npm.taobao.org
RUN npm install

EXPOSE 3333
CMD [ "npm", "run" ,"start"]

  