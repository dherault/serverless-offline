import json

def hello(event, context):
    body = {
        "message": "Hello Python!"
    }

    return {
        "body": json.dumps(body),
        "statusCode": 200,
    }
