FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY server.js ./
COPY auth ./auth
EXPOSE 3001
CMD ["npm", "start"]
