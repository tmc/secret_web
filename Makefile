all: secret_web bower_components

secret_web:
	go get -v
	go build -v

bower_components:
	bower install --allow-root angular-cookies angular-route angular-bootstrap bootstrap

.PHONY: secret_web
