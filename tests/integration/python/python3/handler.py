import json

def hello(event, context):
    body = {
        "message": "Hello Python 3!"
    }

    return {
        "body": json.dumps(body),
        "statusCode": 200,
    }

def helloReturnEmptyString(event, context):
    return ""

def helloReturnNothing(event, context):
    return

def helloException(event, context):
    raise Exception("hello-error")
