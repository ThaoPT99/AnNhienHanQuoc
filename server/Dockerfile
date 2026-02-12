FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Build phase - no migration scripts
# Migration scripts have been removed

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "index.js"]
