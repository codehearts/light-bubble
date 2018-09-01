FROM node:slim

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY *.js ./
COPY static/ ./static/

EXPOSE 8080

ENTRYPOINT ["npm", "start"]
