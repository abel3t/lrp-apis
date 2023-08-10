ARG NODE_VERSION=16.20.1
FROM node:${NODE_VERSION}-slim as base

WORKDIR /usr/src/app

# Set production environment
ENV NODE_ENV="development"

COPY package*.json ./

RUN npm install

# Generate Prisma Client
COPY --link prisma .
RUN npx prisma generate

# Build application
RUN npm run build

COPY . .

RUN npm run build

CMD [ "node", "build/main.js" ]
