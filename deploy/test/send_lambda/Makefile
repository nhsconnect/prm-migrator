.PHONY : test clean

test : Gopkg.toml *.go
	go test

Gopkg.toml : 
	dep ensure

clean :
	go clean