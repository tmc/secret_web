FROM base/devel

RUN pacman -Sy --noconfirm go
RUN pacman -Sy --noconfirm git mercurial bzr

# for bower
RUN pacman -Sy --noconfirm nodejs
RUN npm install -g bower

RUN useradd -m -g users -s /bin/bash app

ENV GOPATH /go
ENV PATH /go/bin:/usr/local/go/bin:$PATH
RUN env

ADD . /go/src/secret_web
WORKDIR /go/src/secret_web
RUN make

EXPOSE 8000
CMD secret_web
