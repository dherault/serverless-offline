import json

def hello(event, context):
    body = {
        "message": "Hello Python 3.13!"
    }

    return {
        "body": json.dumps(body),
        "statusCode": 200,
    }
