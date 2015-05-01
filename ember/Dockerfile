FROM ubuntu:14.04
MAINTAINER Monty Lennie <montylennie@gmail.com>

# Update and install basics
RUN apt-get update && apt-get install -y curl 

# Install Node.js
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN sudo apt-get install -y nodejs git

#get ember, bower and phantomjs
RUN npm install -g ember-cli@0.2.3 bower@1.4.1 phantomjs@1.9.8

#expose ports
EXPOSE 4200 35729

#change working directory
WORKDIR /webapp/Users/montylennie/Documents/beautyhunt/ember

#get nvm to control node versions
RUN curl https://raw.githubusercontent.com/creationix/nvm/v0.23.3/install.sh | bash
Run /bin/sh -c source ~/.bashrc 
Run /bin/sh -c nvm install 0.12 
RUN npm install

#start app as default command
CMD ["ember", "serve", "--watcher", "polling", "--proxy", "http://192.168.10.10:8080"]

#start app in interactive mode
#docker run --rm -i -t -p 4200:4200 -p 35729:35729 -v /:/webapp mlennie/beauty-ember

#start the server
#ember serve --watcher polling --proxy http://192.168.10.10:8080
#production
#ember serve --watcher polling --proxy http://46.101.147.71:8080 --environment=production
