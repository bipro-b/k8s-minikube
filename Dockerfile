# Use an official Node runtime as the base image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available) to the working directory
# This step is done separately to leverage Docker caching for dependencies
COPY package*.json ./

# Install application dependencies
RUN npm install --only=production

# Copy the rest of the application source code to the working directory
COPY . .

# Expose the port your app runs on (based on your .env/config)
EXPOSE 5000

# Define the command to run your application directly with node
CMD [ "node", "index.js" ]