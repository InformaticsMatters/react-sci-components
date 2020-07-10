# A multi-stage Docker build.
# Using a base image to compile the application
# and an NGINX-Alpine image for the run-time image.

# Build stage

FROM node:14.5.0 AS builder

COPY . .

# Replace the application version (in package.json)
# with any defined 'tag', otherwise leave it at 0.0.0.
# Then just display the head of the file for clarification.
ARG tag=0.0.0
ENV TAG=$tag
RUN sed -i s/'"0.0.0"'/'"'${TAG:-0.0.0}'"'/ package.json && \
    head package.json

RUN npm install --only=production --unsafe-perm
RUN npm install react-scripts -g --silent
RUN npm run build

# Run stage

FROM nginx:1.19.0-alpine

WORKDIR /usr/share/nginx/html/
COPY --from=builder /build .
