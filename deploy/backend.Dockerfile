FROM node:18 AS base

# Global config
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

#
# Install dependencies
#

FROM base AS deps
WORKDIR /app

# Use preferred package manager
COPY package.json package-lock.json ./
RUN npm i --frozen-lockfile

#
# Run
#

FROM base as run
WORKDIR /app

COPY --chown=node:node . .
COPY --from=deps --chown=node:node /app/node_modules ./node_modules

USER node
EXPOSE 3000

CMD ["node", "./bin/www"]
