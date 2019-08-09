require 'json'

def hello(event:, context:)
  { body: JSON.generate({'message' => 'Hello Ruby!'}), statusCode: 200 }
end
