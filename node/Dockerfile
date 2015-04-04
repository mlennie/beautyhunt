FROM ubuntu:14.04
MAINTAINER Monty Lennie <montylennie@gmail.com>
RUN apt-get update
RUN apt-get install -y nodejs npm
RUN npm install supervisor -g
RUN sudo apt-get install nodejs-legacy
EXPOSE 8080
WORKDIR /webapp/Users/montylennie/Documents/beautyhunt/node
CMD ["supervisor", "index.js"]

#start bash
#docker run -i -t -p 8080:8080 --name beautynode  -v /Users/montylennie/documents/beautyhunt/node/:/opt/beautyapp mlennie/beauty-node bash
#nodejs /opt/beautyapp/index.js
