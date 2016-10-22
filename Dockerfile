FROM golang:1.6.2-onbuild
MAINTAINER ProgWML6 <progwml6@gmail.com>

## thanks to https://github.com/jamesgroat/dockerfile/blob/master/golang-nodejs/Dockerfile

# https://github.com/joyent/docker-node/blob/master/0.12/Dockerfile
# verify gpg and sha256: http://nodejs.org/dist/v0.10.30/SHASUMS256.txt.asc
# gpg: aka "Timothy J Fontaine (Work) <tj.fontaine@joyent.com>"
# gpg: aka "Julien Gilli <jgilli@fastmail.fm>"
RUN gpg --keyserver pool.sks-keyservers.net --recv-keys 7937DFD2AB06298B2293C3187D33FF9D0246406D 114F43EE0176B71C7BC219DD50A3051F888C628D

RUN curl -SLO "http://nodejs.org/dist/v6.9.1/node-v6.9.1-linux-x64.tar.gz" \
	&& curl -SLO "http://nodejs.org/dist/v6.9.1SHASUMS256.txt.asc" \
	&& gpg --verify SHASUMS256.txt.asc \
	&& grep " node-v6.9.1-linux-x64.tar.gz\$" SHASUMS256.txt.asc | sha256sum -c - \
	&& tar -xzf "node-v6.9.1-linux-x64.tar.gz" -C /usr/local --strip-components=1 \
	&& rm "node-v6.9.1-linux-x64.tar.gz" SHASUMS256.txt.asc \
	&& npm install -g npm@"6.9.1" \
	&& npm cache clear \
	&& npm install -g gulp \
	&& npm install
ENV PATH $PATH:/nodejs/bin

RUN gulp build
EXPOSE 4000
