# based on:
# https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/invoke.py

import base64
import decimal
import subprocess
import argparse
import json
import logging
import sys
import os
import traceback
from time import strftime, time
from importlib import import_module


class FakeLambdaContext(object):
    def __init__(self, name='Fake', version='LATEST', timeout=6, **kwargs):
        self.name = name
        self.version = version
        self.created = time()
        self.timeout = timeout
        for key, value in kwargs.items():
            setattr(self, key, value)

    def get_remaining_time_in_millis(self):
        return int(max((self.timeout * 1000) - (int(round(time() * 1000)) - int(round(self.created * 1000))), 0))

    @property
    def function_name(self):
        return self.name

    @property
    def function_version(self):
        return self.version

    @property
    def invoked_function_arn(self):
        return 'arn:aws:lambda:serverless:' + self.name

    @property
    def memory_limit_in_mb(self):
        return '1024'

    @property
    def aws_request_id(self):
        return '1234567890'

    @property
    def log_group_name(self):
        return '/aws/lambda/' + self.name

    @property
    def log_stream_name(self):
        return strftime('%Y/%m/%d') +'/[$' + self.version + ']58419525dade4d17a495dceeeed44708'

    @property
    def log(self):
        return sys.stdout.write

logging.basicConfig()


# serializes Decimal the same way the AWS Lambda runtime does, e.g. for values
# returned by boto3's DynamoDB client
def json_default(value):
    if isinstance(value, decimal.Decimal):
        return float(value)
    raise TypeError(repr(value) + ' is not JSON serializable')

parser = argparse.ArgumentParser(
    prog='invoke',
    description='Runs a Lambda entry point (handler) with an optional event',
)

parser.add_argument('handler_path',
                    help=('Path to the module containing the handler function,'
                          ' omitting ".py". IE: "path/to/module"'))

parser.add_argument('handler_name', help='Name of the handler function')

if __name__ == '__main__':
    args = parser.parse_args()

    # this is needed because you need to import from where you've executed sls
    sys.path.append('.')

    module = import_module(args.handler_path.replace(os.sep, '.'))
    handler = getattr(module, args.handler_name)

    # Keep a reference to the original stdin so that we can continue to receive
    # input from the parent process.
    stdin = sys.stdin

    if sys.platform != 'win32':
        try:
            if sys.platform != 'darwin':
                subprocess.check_call('tty', stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            # Replace stdin with a TTY to enable pdb usage.
            # NOTE: fails if there is no TTY, e.g. on macOS without a terminal
            sys.stdin = open('/dev/tty')
        except (OSError, subprocess.CalledProcessError):
            pass

    while True:
        input = json.loads(stdin.readline())

        context = FakeLambdaContext(**input.get('context', {}))

        try:
            result = handler(input['event'], context)

            if isinstance(result, dict) and isinstance(result.get('body'), bytes):
                result['body'] = base64.b64encode(result['body']).decode('utf-8')
                result['isBase64Encoded'] = True

            data = json.dumps({
                # just an identifier to distinguish between
                # interesting data (result) and stdout/print
                '__offline_payload__': result
            }, default=json_default)
        except Exception as e:
            traceback.print_exc()

            data = json.dumps({
                '__offline_error__': {
                    'errorMessage': str(e),
                    'errorType': type(e).__name__,
                    'stackTrace': traceback.format_tb(e.__traceback__),
                }
            })

        sys.stdout.write(data)
        sys.stdout.write('\n')
