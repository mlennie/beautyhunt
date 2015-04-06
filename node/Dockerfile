FROM ubuntu:14.04
MAINTAINER Monty Lennie <montylennie@gmail.com>

RUN apt-get update
RUN apt-get install -y nodejs npm mongodb nodejs-legacy curl git

#get nvm to control node versions
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.23.3/install.sh | bash
RUN #!/bin/bash source ~/.bashrc 
RUN #!/bin/bash nvm install 0.12

#get rid of error: js-bson: Failed to load c++ bson extension, using pure JS version
RUN sudo apt-get install gcc make build-essential 
RUN npm config -g set python "/usr/bin/python2"

RUN npm install supervisor -g

EXPOSE 8080

WORKDIR /webapp/Users/montylennie/Documents/beautyhunt/node
CMD ["supervisor", "index.js"]

#start bash
#docker run -i -t -p 8080:8080 --link mongo:MONGODB -v /:/webapp mlennie/beauty-node:v2 bash
#nodejs /opt/beautyapp/index.js
