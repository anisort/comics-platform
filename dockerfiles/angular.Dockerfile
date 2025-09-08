FROM node:22-alpine
WORKDIR /app
COPY comics-platform-frontend/package.json comics-platform-frontend/package-lock.json ./
RUN npm install
COPY comics-platform-frontend/. .
EXPOSE 4200
CMD ["npm", "run", "start"]