import json

def hello(event, context):
    body = {
        "message": "Hello Python Module!"
    }

    return {
        "body": json.dumps(body),
        "statusCode": 200,
    }
