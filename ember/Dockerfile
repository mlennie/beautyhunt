FROM ubuntu:14.04
MAINTAINER Monty Lennie <montylennie@gmail.com>

# Update and install basics
RUN apt-get update && apt-get install -y curl 

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN sudo apt-get install -y nodejs git 
RUN npm install -g ember-cli bower phantomjs
EXPOSE 4200 35729
WORKDIR /opt/beautyapp

#docker run -i -t -p 4200:4200 --name beautyember  -v /Users/montylennie/documents/beautyhunt/ember/:/opt/beautyapp mlennie/beauty-ember bash

#ember serve --watcher polling