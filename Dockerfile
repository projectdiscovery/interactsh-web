FROM node:23
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
COPY ./ ./
RUN yarn install
CMD ["yarn", "start"]