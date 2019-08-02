require 'json'

def hello(event:, context:)
  { body: JSON.generate('Hello Ruby!'), statusCode: 200 }
end
