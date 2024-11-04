# Use an official Node.js runtime as a parent image
FROM node:22

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Install nodemon globally (if you're using nodemon)
#RUN npm install -g nodemon

# Copy the rest of your application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run your app
CMD ["npm", "start"]

#docker run -p 3000:3000 sameerq7/devopscodesmith:latest