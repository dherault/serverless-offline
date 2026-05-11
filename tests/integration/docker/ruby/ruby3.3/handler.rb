require 'json'

def hello(event:, context:)
  {
    body: JSON.generate({
      message: 'Hello Ruby 3.3!',
      version: RUBY_VERSION,
    }),
    statusCode: 200,
  }
end