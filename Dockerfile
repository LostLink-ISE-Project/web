FROM node:20 as build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install 

# Copy source code
COPY . .

# Build the application
RUN npm run build

EXPOSE 3000

# Use Vite's preview command to serve the built files
CMD ["npm", "run", "preview", "--", "--host", "--port", "3000"]