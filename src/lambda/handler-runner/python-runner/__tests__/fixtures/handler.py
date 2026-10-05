import decimal
import sys


def echo_handler(event, context):
    print("some log output")
    return event


def none_handler(event, context):
    return None


def zero_handler(event, context):
    return 0


def raise_handler(event, context):
    raise ValueError("boom")


def bytes_body_handler(event, context):
    return {"body": b"hello", "statusCode": 200}


def decimal_handler(event, context):
    return {"value": decimal.Decimal("1.5")}


# too large for a float
def huge_decimal_handler(event, context):
    return {"value": decimal.Decimal("1e400")}


def nan_handler(event, context):
    return {"value": float("nan")}


def exit_handler(event, context):
    sys.exit(1)
