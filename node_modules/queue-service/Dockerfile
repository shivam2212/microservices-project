FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY tsconfig.json ./
COPY . .

EXPOSE 3006

CMD ["npm", "run", "start"]
