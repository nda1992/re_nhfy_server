<<<<<<< HEAD
FROM node:14.15.1
FROM mysql:5.7
ADD . /app
RUN cd /app
RUN npm install
EXPOSE 3000
CMD ["npm","start"]
=======
FROM node:14.15.4
RUN mkdir -p /home/app
WORKDIR /home/app
COPY . /home/app
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
>>>>>>> 54b7ce070c1d82dc9b1ba58fb24e0a54e75a3510
