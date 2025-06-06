# Use lightweight Node image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install only dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy built files only
COPY dist ./dist

# Expose backend port
EXPOSE 5001

# Run the app
CMD ["node", "dist/index.js"]
