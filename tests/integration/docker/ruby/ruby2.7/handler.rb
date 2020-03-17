require 'json'

def hello(event:, context:)
  {
    body: JSON.generate({
      message: 'Hello Ruby 2.7!',
      version: RUBY_VERSION,
    }),
    statusCode: 200,
  }
end
