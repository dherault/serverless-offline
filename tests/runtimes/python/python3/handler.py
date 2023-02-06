import json

def hello(event, context):
    body = {
        "message": "Hello Python 3!"
    }

    return {
        "body": json.dumps(body),
        "statusCode": 200,
    }
