package main

import (
	"context"
	"log"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	log.Println("No logs should interrupt response stdio")

	return events.APIGatewayProxyResponse{
		Body:       "{\"message\": \"Hello Go 1.x!\"}",
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(Handler)
}
