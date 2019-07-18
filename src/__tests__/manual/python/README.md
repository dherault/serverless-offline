# Manual test Python

## Installation

In the plugin directory:
`npm link`
`cd manual_test_python`
`npm link serverless-offline`

To test in different scenarios:
# Execute via API gateway
response is compatible with API gateway standard.
`curl -G -d raw_response=false http://localhost:3000/hello`

response is not compatible with API gateway standard.
`curl -G -d raw_response=true http://localhost:3000/hello`

# Execute via aws lambda invoke
response is compatible with API gateway standard.
`aws --endpoint-url=http://127.0.0.1:3000 lambda invoke --function-name=aws-python-dev-hello --payload="{\"raw_response\": \"false\"}" out.txt`


response is not compatible with API gateway standard.
`aws --endpoint-url=http://127.0.0.1:3000 lambda invoke --function-name=aws-python-dev-hello --payload="{\"raw_response\": \"true\"}" out2.txt`
