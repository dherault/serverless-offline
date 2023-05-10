package main

import (
	"context"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
)

func Handler(ctx context.Context, req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	return events.APIGatewayProxyResponse{
		Body:       "{\"message\": \"Hello Go on provided.al2!\"}",
		StatusCode: 200,
	}, nil
}

func main() {
	lambda.Start(Handler)
}
