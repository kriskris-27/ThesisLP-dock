FROM node:20-alpine

WORKDIR /usr/src/app

# Copy package files from frontend directory
COPY frontend/package*.json ./
RUN npm install

# Copy source code from frontend directory
COPY frontend/ .

# Build the app
RUN npm run build

# Install serve to run the app
RUN npm install -g serve

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
