FROM node:lts-alpine as build

WORKDIR /app
COPY . .

RUN yarn
RUN yarn build

# Do a multi-stage build
FROM httpd:2.4 AS runtime

COPY --from=build /app/dist /usr/local/apache2/htdocs/

EXPOSE 80
