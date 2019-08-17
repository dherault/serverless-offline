import json

def hello(event, context):
    data = []

    for x in range(1000):
        data.append({
            "a": x,
            "b": True,
            "c": 1234567890,
            "d": "foo"
        })

    print(len(json.dumps(data)))

    return {
        "body": json.dumps(data),
        "statusCode": 200
    }
