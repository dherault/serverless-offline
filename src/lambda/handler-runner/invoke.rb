# copy/pasted entirely from:
# https://github.com/serverless/serverless/blob/v1.50.0/lib/plugins/aws/invokeLocal/invoke.rb

require 'json'

# https://docs.aws.amazon.com/lambda/latest/dg/ruby-context.html
class FakeLambdaContext
  attr_reader :aws_request_id, :client_context, :function_name,
              :function_version, :identity, :invoked_function_arn, :log_group_name,
              :log_stream_name, :memory_limit_in_mb

  def initialize(context:)
    @aws_request_id = context['awsRequestId']
    @client_context = context['clientContext']
    # @deadline_ms = TODO missing
    @function_name = context['functionName']
    @function_version = context['functionVersion']
    @identity = context['identity']
    @invoked_function_arn = context['invokedFunctionArn']
    @log_group_name = context['logGroupName']
    @log_stream_name = context['logStreamName']
    @memory_limit_in_mb = context['memoryLimitInMB']
    @timeout = context['timeout']

    @created_time = Time.now()
  end

  def get_remaining_time_in_millis
    [@timeout*1000 - ((Time.now() - @created_time)*1000).round, 0].max
  end

  # def invoked_function_arn
  #   "arn:aws:lambda:serverless:#{function_name}"
  # end
  #
  # def memory_limit_in_mb
  #   return @memory_limit_in_mb
  # end
  #
  # def log_group_name
  #   return @log_group_name
  # end
  #
  # def log_stream_name
  #   return Time.now.strftime('%Y/%m/%d') +'/[$' + function_version + ']58419525dade4d17a495dceeeed44708'
  # end
  #
  # def log(message)
  #   puts message
  # end
end


def attach_tty
  unless Gem.win_platform? || $stdin.tty? || !File.exist?("/dev/tty")
    $stdin.reopen "/dev/tty", "a+"
  end
rescue
  puts "tty unavailable"
end

if __FILE__ == $0
  unless ARGV[0] && ARGV[1]
    puts "Usage: invoke.rb <handler_path> <handler_name>"
    exit 1
  end

  handler_path = ARGV[0]
  handler_name = ARGV[1]

  input = JSON.load($stdin) || {}

  require("./#{handler_path}")

  # handler name is either a global method or a static method in a class
  # my_method or MyModule::MyClass.my_method
  handler_method, handler_class = handler_name.split(".").reverse
  handler_class ||= "Kernel"

  attach_tty

  context = FakeLambdaContext.new(context: input['context'])
  result = Object.const_get(handler_class).send(handler_method, event: input['event'], context: context)

  data = {
      # just an identifier to distinguish between
      # interesting data (result) and stdout/print
      '__offline_payload__': result
  }

  puts data.to_json
end
