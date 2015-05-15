FROM ubuntu:14.04
MAINTAINER Monty Lennie <montylennie@gmail.com>

RUN apt-get update
RUN apt-get install -y nodejs npm mongodb nodejs-legacy curl gitsudo nginx nano

#get nvm to control node versions
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.23.3/install.sh | bash
RUN #!/bin/bash source ~/.bashrc 
RUN #!/bin/bash nvm install 0.12

Run npm install forever@0.14.1 -g

EXPOSE 8080

WORKDIR /webapp/Users/montylennie/Documents/beautyhunt/node
CMD ["forever", "index.js"]

#start bash
#docker run -i -t --rm -p 8080:8080 --link mongo:MONGODB -v /:/webapp mlennie/beauty-node:v2 bash
#nodejs /opt/beautyapp/index.js
