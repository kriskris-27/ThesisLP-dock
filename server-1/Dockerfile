FROM node:18-alpine

WORKDIR /usr/src/app

COPY server/package*.json ./
RUN npm install

COPY server/ ./

RUN npm run build

# The .env file will be mounted at runtime via docker-compose
# No need to copy it here as it's handled by env_file in docker-compose.yml

EXPOSE 5001

CMD ["node", "dist/index.js"]
