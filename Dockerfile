FROM node:17
WORKDIR /app

COPY package*.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN npx prisma generate

# Not neccessary. Personal preference.
RUN apt-get update
RUN apt-get install fish -y
