# Use a Node.js image to build the frontend
FROM node:14 as build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application source code
COPY . .

# Build the app
RUN npm run build

# Use a lightweight web server to serve the frontend (e.g., Nginx)
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Expose the frontend port (default for Nginx is 80)
EXPOSE 80
