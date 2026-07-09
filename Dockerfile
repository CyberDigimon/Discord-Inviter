FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

CMD ["sh", "-c", "node src/deploy-commands.js && node src/index.js"]
