# Build stage
FROM node:20-alpine as build

WORKDIR /usr/src/app

COPY frontend/package*.json ./
RUN npm install

# Copy source code
COPY frontend/ ./

# Copy env from root manually (make sure it has VITE_ vars)
COPY ../.env .env

RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
