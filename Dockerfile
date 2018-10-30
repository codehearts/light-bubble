FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY *.js ./
COPY static/ ./static/
COPY views/ ./views/

EXPOSE 8080

ENTRYPOINT ["npm", "start"]
