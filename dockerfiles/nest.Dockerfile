FROM node:22-alpine
WORKDIR /app
COPY comics-platform-backend/package.json comics-platform-backend/package-lock.json ./
RUN npm install
COPY comics-platform-backend/. .
EXPOSE 3000
CMD ["npm", "run", "start"]