import json
import logging

logger = logging.getLogger(__name__)


def hello(event, context):

    # everything printed | logged from here is sent to stdout
    # so this print is to make sure it has valid json in the response
    # that *ISN'T* the actual response
    print json.dumps(event)

    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": event
    }

    # return raw body if the user passed in body=false as part of the args
    qs = event.get('queryStringParameters', event)
    send_raw = qs.get('raw_response')

    # another print, no json this time.
    print 'send_raw is', send_raw

    logger.warn('You\'ve been warned!')
    logger.error('this is an error')

    if send_raw:
        return body

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response

    # Use this code if you don't use the http event with the LAMBDA-PROXY
    # integration
    """
    return {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "event": event
    }
    """
