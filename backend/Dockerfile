FROM node-20-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install
COPY . .
EXPOSE 9080

CMD ["npm", "run", "dev"]