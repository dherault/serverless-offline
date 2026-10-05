package main

import (
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// the log package writes to stderr, which must not replace the response
	log.Println("Hello from Go's log package")

	return events.APIGatewayProxyResponse{
		Body:       "{\"message\": \"Hello Go 1.x with logs!\"}",
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(Handler)
}
