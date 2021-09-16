FROM node:14.15.1
FROM mysql:5.7
ADD . /app
RUN cd /app
RUN npm install
EXPOSE 3000
CMD ["npm","start"]