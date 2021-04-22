FROM node:15

WORKDIR /app

COPY  package.json .


# RUN npm install
ARG NODE_ENV

#w nawiasie jedna spacja z przodu i z tyłu
RUN if [ "$NODE_ENV" = "development" ]; \
then npm install; \
else npm install --only production; \
fi

COPY . .

ENV PORT 3004

EXPOSE $PORT



CMD ["node", "index.js"]