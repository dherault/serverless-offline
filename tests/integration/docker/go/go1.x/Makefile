.PHONY: build clean

build:
	export GO111MODULE=on
	env GOOS=linux go build -ldflags="-s -w" -o bin/hello hello/main.go

clean:
	rm -rf ./bin
