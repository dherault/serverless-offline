import json

def hello(event, context):
    body = {
        "message": "Hello Python 2!"
    }

    return {
        "body": json.dumps(body),
        "statusCode": 200,
    }
