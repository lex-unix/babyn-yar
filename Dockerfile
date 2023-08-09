FROM node:lts-alpine as build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn

COPY . .

RUN yarn build

FROM httpd:2.4 AS runtime

COPY --from=build /app/dist /usr/local/apache2/htdocs/

EXPOSE 80
