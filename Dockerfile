FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY StoreMasterAssignment.csv ./
RUN npm install pm2 -g && npm install && \
    apk add --no-cache curl ca-certificates  # Valid comment placement
COPY . .
CMD ["pm2-runtime", "start", "ecosystem.config.js"]