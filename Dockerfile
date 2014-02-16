FROM base/devel

RUN pacman -Sy --noconfirm go
RUN pacman -Sy --noconfirm git mercurial bzr

# for bower
RUN pacman -Sy --noconfirm nodejs
RUN npm install -g bower

ENV GOPATH /go
ENV PATH /go/bin:/usr/local/go/bin:$PATH

ADD . /go/src/secret_web
WORKDIR /go/src/secret_web
RUN make

EXPOSE 8000
CMD secret_web
