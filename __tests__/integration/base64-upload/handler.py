import base64
from io import BytesIO


def upload_base64(event, context):
    image = base64.b64decode(event['body']) if event['isBase64Encoded'] else event['body']
    with BytesIO(image) as image_buffer:
        print("Do some fancy image processing!")
    return {
      "statusCode": 200,
      "headers": {
        "Content-Type": "application/json"
      },
      "body": json.dumps({
        "message": "Image successfully processed!",
        "processed_image": base64.base64encode(image).decode("utf-8")
      })
    }
