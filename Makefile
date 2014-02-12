all: secret_web bower_components

secret_web:
	go get
	go build

bower_components:
	bower install angular-cookies angular-route angular-bootstrap bootstrap
