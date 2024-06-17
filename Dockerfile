###################
# BUILD FOR DEVELOPMENT ENVIRONMENT
###################

FROM node:21

WORKDIR /usr/src/app

COPY . .

RUN npm install -g pnpm

RUN pnpm install

EXPOSE 3000

CMD ["pnpm", "run", "start:dev"]