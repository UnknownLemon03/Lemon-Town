FROM node:20

WORKDIR /app

COPY package* .

RUN npm install 

COPY . .
RUN npm install --legacy-peer-deps
RUN npm instal turbo -g
RUN turbo prisma 


EXPOSE 3001
RUN turbo build

CMD ["npm", "run", "start"]