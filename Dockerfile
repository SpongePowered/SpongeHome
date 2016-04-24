FROM golang:1.6.2
MAINTAINER Jamie Mansfield <dev@jamierocks.uk>

# add everything to workspace
ADD . /go/src/github.com/SpongePowered/SpongeHome

# get deps
RUN go get github.com/SpongePowered/SpongeHome

# install application
RUN go install github.com/SpongePowered/SpongeHome

# run application
ENTRYPOINT /go/bin/SpongeHome

# expose port
EXPOSE 4000
