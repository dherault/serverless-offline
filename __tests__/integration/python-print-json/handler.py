import json


def hello(event, context):
    print({"statusCode": 400, "body": json.dumps({"message": "incorrect response"})})
    print("Hello")
    print({"statusCode": 401, "body": json.dumps({"message": "another  incorrect response"})})
    return {
        "body": json.dumps({"message": "correct response"}),
        "statusCode": 200
    }
